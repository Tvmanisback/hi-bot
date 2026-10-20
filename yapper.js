/**
 * Yapper bot SDK, one file, no dependencies. Node 18+, Bun and Deno.
 *
 *   import { Bot } from './yapper.js';
 *   const bot = new Bot(process.env.YAPPER_BOT_TOKEN);
 *   bot.command('ping', 'Check the bot is alive', (msg) => msg.reply('pong'));
 *   bot.on('message', (msg) => { if (msg.mentioned) msg.reply('hi!'); });
 *   bot.on('member_join', async (ev) => {
 *     const [general] = await bot.channels(ev.server_id, { type: 'text' });   // member events have no channel
 *     if (general) bot.send(general.id, `welcome <@${ev.user_id}>`);
 *   });
 *   bot.command('info', 'A card', (msg) => msg.reply('', { embeds: [new Embed().title('Hi').description('**Embeds** work').color('#5865f2')] }));
 *   bot.command('vote', 'Buttons', (msg) => msg.reply('Pizza?', { components: [new Row(Button.success('Yes', 'vote:yes'), Button.danger('No', 'vote:no'))] }));
 *   bot.onButton(/^vote:/, (i) => i.ephemeral(`You picked ${i.custom_id.slice(5)}`));
 *   await bot.loadCogs('./cogs');   // optional: more commands from cogs/*.js (see Cog below)
 *   bot.start();
 *
 * Nothing to host: the bot fetches its own events from Yapper (long polling), so it runs on your PC.
 * Verified bots can also run on Yapper's bot hosting, which passes the token in process.env.YAPPER_BOT_TOKEN.
 * Docs: https://www.yapper.website/developers
 */
/** Embeds, buttons and rows can be builders or plain objects. */
const plain = (x) => (x && typeof x.toJSON === 'function' ? x.toJSON() : x);
const list = (v) => (v === undefined ? undefined : v === null ? null : [].concat(v).map(plain));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** `{ messages, authors }` from the API → the messages, each with its `author` (null if the account is gone). */
const withAuthors = (out) => {
  const by = new Map((out.authors || []).map((a) => [a.id, a]));
  return (out.messages || []).map((m) => ({ ...m, author: by.get(m.author_id) ?? null }));
};
/** Wait before retry number n (1, 2, …): 1s, 2s, 4s … up to 30s, with some jitter so many bots don't sync up. */
const backoff = (n) => Math.min(30_000, 1000 * 2 ** (n - 1)) * (0.75 + Math.random() * 0.5);
/** A class made with `extends Cog` (not Cog itself). Checked by a flag, so a second copy of yapper.js still works. */
const isCogClass = (c) => typeof c === 'function' && c.yapperCog === true && !Object.hasOwn(c, 'yapperCog');
/** Marks an error with the cog (and command or event) it came from, so the log says where it broke. */
const tagError = (e, owner, where) => {
  const err = e instanceof Error ? e : new Error(String(e));
  if (err.cog === undefined) { try { err.cog = owner.name; if (where) err.where = where; } catch { /* frozen error */ } }
  return err;
};
/** Runs fn with `self` as this and tags anything it throws with the cog. */
const tagged = (owner, fn, self, where) => async (x) => { try { return await fn.call(self, x); } catch (e) { throw tagError(e, owner, where); } };
const COMMAND_LIMIT = 100;

/**
 * Finds a cog file or folder. Relative paths are tried next to your main file first (the one you ran with
 * `node bot.js`), then in the folder you ran node in. Also takes absolute paths and file:// URLs.
 * Returns { abs, url, label }; url is what import() wants, also on Windows.
 */
async function locate(target) {
  const [{ pathToFileURL, fileURLToPath }, path, fs] = await Promise.all([import('node:url'), import('node:path'), import('node:fs')]);
  const raw = target instanceof URL ? target.href : String(target ?? '');
  let tries;
  if (/^file:/i.test(raw)) tries = [fileURLToPath(raw)];
  else if (path.isAbsolute(raw)) tries = [raw];
  else {
    const main = typeof process !== 'undefined' && process.argv?.[1] ? path.dirname(path.resolve(process.argv[1])) : null;
    tries = [...new Set([main && path.resolve(main, raw), path.resolve(process.cwd(), raw)].filter(Boolean))];
  }
  // 'cogs/fun' works too: try .js and .mjs.
  const found = tries.flatMap((p) => (/\.m?js$/i.test(p) ? [p] : [p, `${p}.js`, `${p}.mjs`])).find((p) => fs.existsSync(p));
  if (!found) throw new Error(`Can't find ${raw} (looked at ${tries.join(' and ')})`);
  const rel = path.relative(process.cwd(), found);
  const label = (rel && !rel.startsWith('..') && !path.isAbsolute(rel) ? rel : found).split(path.sep).join('/');
  return { abs: found, url: pathToFileURL(found).href, label };
}

export class Bot {
  /**
   * @param {string} token from Settings → Developer
   * @param {{ base?: string, prefixes?: string[], log?: boolean, ignoreBots?: boolean }} [opts]
   *   `ignoreBots` (default true): skip messages from other bots and webhooks (`msg.author_bot`), so two bots can't
   *   reply to each other forever. Pass false to get them too.
   */
  constructor(token, opts = {}) {
    if (!token || !String(token).startsWith('yb_')) throw new Error('Pass your bot token (starts with yb_). Get one in Settings → Developer.');
    this.token = String(token).trim();
    this.base = (opts.base || 'https://www.yapper.website').replace(/\/$/, '');
    this.prefixes = opts.prefixes ?? ['!', '/', '.'];
    this.log = opts.log !== false;
    this.ignoreBots = opts.ignoreBots !== false;
    this._handlers = new Map();
    this._commands = new Map();
    this._buttonHandlers = [];
    this._cogs = new Map();
    this._running = false;
    this._abort = null;
    this._user = null;
  }

  /** Register a message command. `name` is without the prefix. */
  command(name, description, handler) {
    if (typeof description === 'function') { handler = description; description = ''; }
    name = String(name).toLowerCase().trim();
    if (!name) throw new Error('command name required');
    if (this._commands.size >= COMMAND_LIMIT) throw new Error(`at most ${COMMAND_LIMIT} commands`);
    this._commands.set(name, { description: String(description || ''), handler });
    return this;
  }

  /** Listen for an event: 'message', 'member_join', 'member_leave', 'ready', … */
  on(event, handler) {
    if (!this._handlers.has(event)) this._handlers.set(event, []);
    this._handlers.get(event).push(handler);
    return this;
  }

  /** Handle button clicks. `match` is a string (exact custom_id) or RegExp. */
  onButton(match, handler) {
    this._buttonHandlers.push({ match, handler });
    return this;
  }

  /** Load one or more cog files / folders. Each export that `extends Cog` is registered. */
  async loadCogs(...targets) {
    for (const target of targets.flat()) {
      const { url, label } = await locate(target);
      const mod = await import(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now());
      const classes = Object.values(mod).filter(isCogClass);
      if (!classes.length) throw new Error(`${label} exports no Cog subclass`);
      for (const Cls of classes) {
        const cog = new Cls(this);
        if (this._cogs.has(cog.name)) throw new Error(`cog "${cog.name}" already loaded`);
        this._cogs.set(cog.name, cog);
        if (typeof cog.setup === 'function') await cog.setup();
        for (const [name, { description, handler }] of cog._commands) {
          if (this._commands.has(name)) throw new Error(`command "${name}" already registered (cog ${cog.name})`);
          this._commands.set(name, { description, handler: tagged(cog, handler, cog, name) });
        }
        for (const [event, handlers] of cog._handlers) {
          for (const h of handlers) this.on(event, tagged(cog, h, cog, event));
        }
        for (const { match, handler } of cog._buttonHandlers) {
          this.onButton(match, tagged(cog, handler, cog, 'button'));
        }
        if (this.log) console.log(`[yapper] loaded cog ${cog.name} from ${label}`);
      }
    }
    return this;
  }

  /** Start long-polling. Resolves when the bot stops (or rejects on fatal error). */
  async start() {
    if (this._running) throw new Error('already running');
    this._running = true;
    this._abort = new AbortController();
    let retries = 0;
    while (this._running) {
      try {
        const events = await this._poll();
        retries = 0;
        for (const ev of events) await this._dispatch(ev);
      } catch (e) {
        if (!this._running || e.name === 'AbortError') break;
        retries++;
        const wait = backoff(retries);
        if (this.log) console.error(`[yapper] poll error (retry in ${Math.round(wait)}ms):`, e.message || e);
        await sleep(wait);
      }
    }
  }

  /** Stop the bot (and any in-flight poll). */
  stop() {
    this._running = false;
    this._abort?.abort();
  }

  // ─── API helpers ───────────────────────────────────────────────────────────

  async _api(method, path, body, opts = {}) {
    const headers = { Authorization: `Bot ${this.token}`, Accept: 'application/json' };
    let payload;
    if (body !== undefined) {
      headers['Content-Type'] = 'application/json';
      payload = JSON.stringify(body);
    }
    const res = await fetch(`${this.base}/api/v1${path}`, {
      method,
      headers,
      body: payload,
      signal: opts.signal ?? this._abort?.signal,
    });
    if (res.status === 204) return null;
    const text = await res.text();
    let data;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }
    if (!res.ok) {
      const err = new Error(data?.error || data?.message || text || res.statusText);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  async _poll() {
    const data = await this._api('GET', '/bots/gateway?timeout=25', undefined, { signal: this._abort.signal });
    if (!this._user && data?.bot) {
      this._user = data.bot;
      await this._emit('ready', data.bot);
    }
    return data?.events || [];
  }

  async _dispatch(ev) {
    const type = ev.type || ev.t;
    const data = ev.data || ev.d || ev;
    try {
      if (type === 'MESSAGE_CREATE' || type === 'message') {
        const msg = this._wrapMessage(data);
        if (this.ignoreBots && msg.author_bot) return;
        await this._emit('message', msg);
        const text = (msg.content || '').trim();
        for (const prefix of this.prefixes) {
          if (!text.startsWith(prefix)) continue;
          const rest = text.slice(prefix.length).trim();
          const space = rest.indexOf(' ');
          const name = (space === -1 ? rest : rest.slice(0, space)).toLowerCase();
          const args = space === -1 ? '' : rest.slice(space + 1).trim();
          const cmd = this._commands.get(name);
          if (cmd) {
            msg.args = args;
            msg.command = name;
            await cmd.handler(msg);
          }
          break;
        }
      } else if (type === 'INTERACTION_CREATE' || type === 'interaction') {
        if (data.type === 'button' || data.component_type === 'button') {
          const i = this._wrapInteraction(data);
          for (const { match, handler } of this._buttonHandlers) {
            const ok = typeof match === 'string' ? match === i.custom_id : match.test(i.custom_id);
            if (ok) { await handler(i); break; }
          }
        }
      } else if (type === 'MEMBER_JOIN' || type === 'member_join') {
        await this._emit('member_join', data);
      } else if (type === 'MEMBER_LEAVE' || type === 'member_leave') {
        await this._emit('member_leave', data);
      } else {
        await this._emit(type.toLowerCase(), data);
      }
    } catch (e) {
      if (this.log) {
        const where = e.cog ? ` (cog ${e.cog}${e.where ? ` / ${e.where}` : ''})` : '';
        console.error(`[yapper] handler error${where}:`, e);
      }
    }
  }

  async _emit(event, data) {
    const list = this._handlers.get(event) || [];
    for (const h of list) await h(data);
  }

  _wrapMessage(raw) {
    const bot = this;
    const msg = {
      ...raw,
      author: raw.author || null,
      get author_bot() { return !!(raw.author?.bot || raw.webhook_id); },
      get mentioned() {
        const me = bot._user?.id;
        if (!me) return false;
        return (raw.mentions || []).some((m) => m.id === me) ||
          new RegExp(`<@!?${me}>`).test(raw.content || '');
      },
      reply(content, opts = {}) {
        return bot.send(raw.channel_id, content, { ...opts, reply_to: raw.id });
      },
      edit(content, opts = {}) {
        return bot.edit(raw.channel_id, raw.id, content, opts);
      },
      delete() {
        return bot.delete(raw.channel_id, raw.id);
      },
      react(emoji) {
        return bot.react(raw.channel_id, raw.id, emoji);
      },
    };
    return msg;
  }

  _wrapInteraction(raw) {
    const bot = this;
    return {
      ...raw,
      custom_id: raw.custom_id || raw.data?.custom_id,
      async reply(content, opts = {}) {
        return bot._api('POST', `/interactions/${raw.id}/${raw.token}/callback`, {
          type: 'channel_message',
          data: { content: content ?? '', ...opts, embeds: list(opts.embeds), components: list(opts.components) },
        });
      },
      async ephemeral(content, opts = {}) {
        return bot._api('POST', `/interactions/${raw.id}/${raw.token}/callback`, {
          type: 'channel_message',
          data: { content: content ?? '', flags: 64, ...opts, embeds: list(opts.embeds), components: list(opts.components) },
        });
      },
      async update(content, opts = {}) {
        return bot._api('POST', `/interactions/${raw.id}/${raw.token}/callback`, {
          type: 'update_message',
          data: { content: content ?? '', ...opts, embeds: list(opts.embeds), components: list(opts.components) },
        });
      },
      async defer(ephemeral = false) {
        return bot._api('POST', `/interactions/${raw.id}/${raw.token}/callback`, {
          type: 'deferred_channel_message',
          data: ephemeral ? { flags: 64 } : {},
        });
      },
    };
  }

  // ─── public API ────────────────────────────────────────────────────────────

  /** Send a message. `content` can be empty if you only send embeds/components. */
  async send(channelId, content, opts = {}) {
    return this._api('POST', `/channels/${channelId}/messages`, {
      content: content ?? '',
      embeds: list(opts.embeds),
      components: list(opts.components),
      reply_to: opts.reply_to,
      tts: opts.tts,
    });
  }

  async edit(channelId, messageId, content, opts = {}) {
    return this._api('PATCH', `/channels/${channelId}/messages/${messageId}`, {
      content: content ?? '',
      embeds: list(opts.embeds),
      components: list(opts.components),
    });
  }

  async delete(channelId, messageId) {
    return this._api('DELETE', `/channels/${channelId}/messages/${messageId}`);
  }

  async react(channelId, messageId, emoji) {
    return this._api('PUT', `/channels/${channelId}/messages/${messageId}/reactions/${encodeURIComponent(emoji)}/@me`);
  }

  async channels(serverId, filter = {}) {
    const all = await this._api('GET', `/servers/${serverId}/channels`);
    let list = all || [];
    if (filter.type) list = list.filter((c) => c.type === filter.type);
    if (filter.name) list = list.filter((c) => c.name === filter.name);
    return list;
  }

  async messages(channelId, opts = {}) {
    const q = new URLSearchParams();
    if (opts.limit) q.set('limit', opts.limit);
    if (opts.before) q.set('before', opts.before);
    if (opts.after) q.set('after', opts.after);
    const out = await this._api('GET', `/channels/${channelId}/messages?${q}`);
    return withAuthors(out || {});
  }

  get user() { return this._user; }
  get commands() { return [...this._commands.keys()]; }
}

/**
 * Base class for cogs. Subclass it, put commands/events on the instance in the
 * constructor (or in setup()), then `await bot.loadCogs('./cogs/fun.js')`.
 *
 *   export class Fun extends Cog {
 *     constructor(bot) {
 *       super(bot);
 *       this.command('roll', 'Roll a die', (msg) => msg.reply(String(1 + Math.floor(Math.random() * 6))));
 *     }
 *   }
 */
export class Cog {
  static yapperCog = true;
  constructor(bot) {
    this.bot = bot;
    this.name = this.constructor.name;
    this._commands = new Map();
    this._handlers = new Map();
    this._buttonHandlers = [];
  }
  command(name, description, handler) {
    if (typeof description === 'function') { handler = description; description = ''; }
    name = String(name).toLowerCase().trim();
    this._commands.set(name, { description: String(description || ''), handler });
    return this;
  }
  on(event, handler) {
    if (!this._handlers.has(event)) this._handlers.set(event, []);
    this._handlers.get(event).push(handler);
    return this;
  }
  onButton(match, handler) {
    this._buttonHandlers.push({ match, handler });
    return this;
  }
}

/** Rich embed builder. */
export class Embed {
  constructor(data = {}) { this.data = { ...data }; }
  title(t) { this.data.title = t; return this; }
  description(d) { this.data.description = d; return this; }
  url(u) { this.data.url = u; return this; }
  color(c) {
    if (typeof c === 'string' && c.startsWith('#')) c = parseInt(c.slice(1), 16);
    this.data.color = c;
    return this;
  }
  timestamp(t = new Date()) { this.data.timestamp = t instanceof Date ? t.toISOString() : t; return this; }
  footer(text, icon_url) { this.data.footer = { text, icon_url }; return this; }
  image(url) { this.data.image = { url }; return this; }
  thumbnail(url) { this.data.thumbnail = { url }; return this; }
  author(name, url, icon_url) { this.data.author = { name, url, icon_url }; return this; }
  field(name, value, inline = false) {
    if (!this.data.fields) this.data.fields = [];
    this.data.fields.push({ name, value, inline });
    return this;
  }
  toJSON() { return this.data; }
}

/** Button builder. Styles: primary, secondary, success, danger, link. */
export class Button {
  constructor(label, custom_id, style = 'primary') {
    this.data = { type: 'button', label: String(label), style, custom_id: custom_id != null ? String(custom_id) : undefined };
  }
  static primary(label, id) { return new Button(label, id, 'primary'); }
  static secondary(label, id) { return new Button(label, id, 'secondary'); }
  static success(label, id) { return new Button(label, id, 'success'); }
  static danger(label, id) { return new Button(label, id, 'danger'); }
  static link(label, url) {
    const b = new Button(label, null, 'link');
    b.data.url = String(url);
    delete b.data.custom_id;
    return b;
  }
  style(s) { this.data.style = s; return this; }
  emoji(e) { this.data.emoji = typeof e === 'string' ? { name: e } : e; return this; }
  url(u) { this.data.style = 'link'; this.data.url = String(u); delete this.data.custom_id; return this; }
  disabled(on = true) { this.data.disabled = !!on; return this; }
  toJSON() { return this.data; }
}

/** A row of up to 5 buttons. */
export class Row {
  constructor(...buttons) { this.buttons = buttons.flat(); }
  add(...buttons) { this.buttons.push(...buttons.flat()); return this; }
  toJSON() { return { type: 'row', components: this.buttons.map(plain) }; }
}

export default Bot;
