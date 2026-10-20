import { Bot } from "./yapper.js";
import { randomInt } from "node:crypto";
import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function getToken() {
  return new Promise((resolve) => {
    rl.question("Enter your Hi Bot token: ", (token) => {
      resolve(token.trim());
    });
  });
}

const token = await getToken();
rl.close();

if (!token.startsWith("yb_")) {
  console.error("That doesn't look like a Yapper bot token.");
  process.exit(1);
}

const bot = new Bot(token);

const warnings = new Map();

const jokes = [
  "Why did the computer get cold? It left its Windows open.",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "Why was the math book sad? It had too many problems."
];

bot.command("ping", "Check whether Hi Bot is online.", (msg) => {
  msg.reply("🏓 Pong! Hi Bot is online!");
});

bot.command("help", "Show Hi Bot's commands.", (msg) => {
  msg.reply(
    [
      "🤖 **Hi Bot Commands**",
      "",
      "**Fun**",
      "/8ball <question>",
      "/roll [sides]",
      "/coinflip",
      "/joke",
      "",
      "**Utilities**",
      "/userinfo",
      "/serverinfo",
      "/poll <question>",
      "",
      "**Other**",
      "/ping",
      "/help"
    ].join("\n")
  );
});

bot.command("8ball", "Ask the magic 8-ball a question.", (msg) => {
  const answers = [
    "🎱 Absolutely!",
    "🎱 Probably!",
    "🎱 Ask again later.",
    "🎱 The answer is unclear.",
    "🎱 Probably not.",
    "🎱 Definitely not!"
  ];

  msg.reply(answers[randomInt(answers.length)]);
});

bot.command("roll", "Roll a die. Example: /roll 20", (msg) => {
  const sides = Number(msg.argv[0] || 6);

  if (!Number.isInteger(sides) || sides < 2 || sides > 1000) {
    msg.reply("Choose a whole number of sides between 2 and 1000.");
    return;
  }

  msg.reply(`🎲 You rolled ${randomInt(1, sides + 1)}!`);
});

bot.command("coinflip", "Flip a virtual coin.", (msg) => {
  msg.reply(randomInt(2) === 0 ? "🪙 Heads!" : "🪙 Tails!");
});

bot.command("joke", "Tell a random joke.", (msg) => {
  msg.reply(jokes[randomInt(jokes.length)]);
});

bot.command("userinfo", "Show your public user information.", (msg) => {
  msg.reply(
    `👤 **User Information**\nUsername: ${msg.author}\nUser ID: ${msg.author_id}`
  );
});

bot.command("serverinfo", "Show information about this server.", async (msg) => {
  if (!msg.server_id) {
    msg.reply("This command must be used in a server.");
    return;
  }

  try {
    const server = await bot.server(msg.server_id);

    msg.reply(
      `🏠 **Server Information**\nName: ${server.name || "Unknown"}\nID: ${msg.server_id}`
    );
  } catch {
    msg.reply("I couldn't retrieve the server information.");
  }
});

bot.command("poll", "Create a simple yes-or-no poll.", (msg) => {
  const question = msg.args.trim();

  if (!question) {
    msg.reply("Usage: /poll Should we play a game?");
    return;
  }

  msg.reply(`📊 **Poll**\n${question}\n\n👍 Yes\n👎 No`);
});

bot.command("warn", "Record a warning for a member by user ID.", (msg) => {
  const parts = msg.args.trim().split(/\s+/);
  const userId = parts.shift();
  const reason = parts.join(" ") || "No reason provided";

  if (!userId || !/^[\w-]{1,100}$/.test(userId)) {
    msg.reply("Usage: /warn USER_ID reason");
    return;
  }

  if (!msg.server_id) {
    msg.reply("Use this command in a server.");
    return;
  }

  // This is a demonstration only, not secure moderation.
  // We must add server permission checks before enabling real warnings.
  const key = `${msg.server_id}:${userId}`;
  const list = warnings.get(key) || [];

  list.push({
    reason,
    moderator: msg.author,
    date: new Date().toISOString()
  });

  warnings.set(key, list);

  msg.reply(
    `⚠️ Demo warning recorded for ${userId}.\nReason: ${reason}\nThis warning is temporary and stored only in memory.`
  );
});

bot.command("warnings", "View demo warnings for a member.", (msg) => {
  const userId = msg.argv[0];

  if (!userId || !msg.server_id) {
    msg.reply("Usage: /warnings USER_ID");
    return;
  }

  const list = warnings.get(`${msg.server_id}:${userId}`) || [];

  if (!list.length) {
    msg.reply("No demo warnings found.");
    return;
  }

  msg.reply(
    list
      .map((w, i) => `${i + 1}. ${w.reason} — ${w.moderator}`)
      .join("\n")
  );
});

bot.command("clearwarnings", "Clear demo warnings for a member.", (msg) => {
  const userId = msg.argv[0];

  if (!userId || !msg.server_id) {
    msg.reply("Usage: /clearwarnings USER_ID");
    return;
  }

  // Permission checks are required before this can be safely enabled.
  warnings.delete(`${msg.server_id}:${userId}`);

  msg.reply("Demo warnings cleared.");
});

bot.on("member_join", (event) => {
  console.log(`Welcome event: ${event.username} joined a server.`);
  console.log("Next step: configure a welcome channel.");
});

bot.on("message", (msg) => {
  if (msg.mentioned) {
    msg.reply(`👋 Hey ${msg.author}! I'm Hi Bot. Try /help!`);
  }
});

bot.on("ready", (me) => {
  console.log(`Hi Bot is online as ${me.username}!`);
});

bot.on("error", (error) => {
  console.error("Hi Bot error:", error);
});

bot.start();
