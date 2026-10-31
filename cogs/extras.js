import { randomInt } from "node:crypto";

const pick = (items) => items[randomInt(items.length)];
const clean = (value) => String(value ?? "").trim();
const truncate = (value, max = 900) => value.length > max ? value.slice(0, max) + "…" : value;

export function setup(bot) {
  const add = (name, description, run) => bot.command(name, description, run);
  const simple = (name, description, output) => add(name, description, (msg) => msg.reply(typeof output === "function" ? output(msg) : output));

  const jokes = [
    "I told my computer I needed a break. It said: no problem, I'll go to sleep.",
    "Why do JavaScript developers wear glasses? Because they don't C#.",
    "Why was the computer tired? It had too many tabs open.",
    "What is a computer's favorite snack? Microchips.",
    "Why did the function break up with the loop? It needed space."
  ];
  const facts = [
    "Octopuses have three hearts.",
    "A day on Venus is longer than its year.",
    "Honey can remain edible for a very long time when stored properly.",
    "Bananas are berries, botanically speaking.",
    "A group of flamingos is called a flamboyance.",
    "Some turtles can breathe through specialized tissue near their tails.",
    "The Eiffel Tower can become slightly taller in hot weather."
  ];
  const quotes = [
    "“Great things are done by a series of small things brought together.” — Vincent van Gogh",
    "“It always seems impossible until it's done.” — Nelson Mandela",
    "“The secret of getting ahead is getting started.” — Mark Twain",
    "“Nothing will work unless you do.” — Maya Angelou"
  ];
  const riddles = [
    ["What has keys but can't open locks?", "A piano."],
    ["What gets wetter the more it dries?", "A towel."],
    ["What has a face and two hands but no arms or legs?", "A clock."],
    ["What has many teeth but cannot bite?", "A comb."],
    ["What can travel around the world while staying in one corner?", "A stamp."]
  ];
  const trivia = [
    ["What is the largest planet in our solar system?", "Jupiter"],
    ["How many sides does a hexagon have?", "Six"],
    ["What is the chemical symbol for gold?", "Au"],
    ["Which ocean is the largest?", "Pacific Ocean"],
    ["What is the capital of Japan?", "Tokyo"],
    ["Which animal is the tallest living land animal?", "Giraffe"]
  ];
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#A78BFA", "#F59E0B", "#22C55E", "#F472B6"];

  simple("newhelp", "Show the new Hi Bot command categories.", [
    "✨ HI BOT — EXTRA COMMANDS",
    "Fun: /compliment /roast /fact /quote /motivate /fortune /vibe /hype /joke2 /pun /dadjoke /clap /emoji /emojify /randomemoji /randomcolor /colorhex /choose /wouldyourather /thisorthat /yesno /coin /magic /nickname /secret /mood /story /madlibs /twister /alphabet /acronym",
    "Games: /trivia /riddle /scramble /guessnumber /mathquiz /truefalse /oddoneout /emojiquiz /memory /wordchain /anagram /quickquiz /finishstory /challenge /brainbreak",
    "Text tools: /reverse /uppercase /lowercase /titlecase /wordcount /charcount /repeat /mockcase /claptext /binary /initials /vowels /consonants /hashtag /quoteformat",
    "Utilities: /date /utc /timestamp /serverid /userid /botinfo /suggest /feedback",
    "Use /commands for the full descriptions."
  ].join("\n"));

  add("commands", "List every extra command.", (msg) => msg.reply([
    "📚 HI BOT — EXTRA COMMANDS",
    "Fun: /compliment, /roast, /fact, /quote, /motivate, /fortune, /vibe, /hype, /joke2, /pun, /dadjoke, /clap, /emoji, /emojify, /randomemoji, /randomcolor, /colorhex, /choose, /wouldyourather, /thisorthat, /yesno, /coin, /magic, /nickname, /secret, /mood, /story, /madlibs, /twister, /alphabet, /acronym",
    "Games: /trivia, /riddle, /scramble, /guessnumber, /mathquiz, /truefalse, /oddoneout, /emojiquiz, /memory, /wordchain, /anagram, /quickquiz, /finishstory, /challenge, /brainbreak",
    "Text: /reverse, /uppercase, /lowercase, /titlecase, /wordcount, /charcount, /repeat, /mockcase, /claptext, /binary, /initials, /vowels, /consonants, /hashtag, /quoteformat",
    "Utilities: /date, /utc, /timestamp, /serverid, /userid, /botinfo, /suggest, /feedback",
    "That’s 72 new commands! Try /newhelp for a compact list."
  ].join("\n")));

  simple("compliment", "Get a friendly compliment.", () => pick(["You're bringing good energy today. ✨", "Your ideas deserve a chance to shine. 🌟", "You make the internet a little more interesting. 😎", "Keep being curious and creative. 🚀"]));
  simple("roast", "Get a gentle, friendly roast.", () => pick(["Your Wi-Fi has more commitment than your attention span. 😂", "You bring 'I'll do it in five minutes' energy. 😭", "Your tabs have tabs. Please seek organization. 💀", "Even your loading screen needs a loading screen."]));
  simple("fact", "Get a random fun fact.", () => "🧠 " + pick(facts));
  simple("quote", "Get an inspirational quote.", () => pick(quotes));
  simple("motivate", "Get a little motivation.", () => pick(["One small step still counts. Keep going! 💪", "You don't need to be perfect to make progress. 🌱", "Take your time, learn as you go, and keep building. 🚀"]));
  simple("fortune", "Get a silly fortune-cookie message.", () => "🥠 " + pick(["A great idea is waiting for you to write it down.", "Your next bug fix may be closer than you think.", "Today is a good day to learn something new.", "A snack break will improve your debugging skills."]));
  simple("vibe", "Get a random vibe.", () => "✨ Your vibe: " + pick(["main character energy", "cozy afternoon", "chaotic genius", "quietly legendary", "creative mode", "maximum chill"]));
  simple("hype", "Get hyped up.", (msg) => "📣 " + (msg.author?.username || "YOU") + ", YOU'VE GOT THIS! KEEP CREATING! 🔥");
  simple("joke2", "Get another random joke.", () => "😂 " + pick(jokes));
  simple("pun", "Hear a random pun.", () => pick(["I used to hate facial hair, but then it grew on me.", "I wondered why the baseball was getting bigger. Then it hit me.", "The calendar's days are numbered.", "I stayed up all night wondering where the sun went. Then it dawned on me."]));
  simple("dadjoke", "Get a classic dad joke.", () => pick(["I only know 25 letters of the alphabet. I don't know y.", "What do you call cheese that isn't yours? Nacho cheese.", "Why can't your nose be 12 inches long? Because then it would be a foot."]));
  simple("clap", "Celebrate something.", () => "👏👏👏 THAT DESERVES A ROUND OF APPLAUSE! 👏👏👏");
  simple("emoji", "Get a random emoji.", () => pick(["😀", "🤖", "🌈", "🚀", "🎮", "🦊", "🍕", "✨", "🧠", "🐸", "🌻", "🎉"]));
  add("emojify", "Add fun emojis to your text.", (msg) => { const t = clean(msg.args); msg.reply(t ? "✨ " + t.replace(/\s+/g, " 🌟 ") + " ✨" : "Usage: /emojify your text"); });
  simple("randomemoji", "Get a random emoji combo.", () => pick(["🔥🚀✨", "🌈🦋🌻", "🎮👾🕹️", "🍕😎🥤", "🐸🍃🌧️"]));
  simple("randomcolor", "Generate a random color name and hex.", () => { const c = pick(colors); return "🎨 Random color: " + c; });
  simple("colorhex", "Show a random hex color.", () => "🎨 " + pick(colors));
  add("choose", "Choose between options separated by |.", (msg) => { const opts = clean(msg.args).split("|").map(x => x.trim()).filter(Boolean); msg.reply(opts.length >= 2 ? "🤔 I choose: **" + pick(opts) + "**" : "Usage: /choose pizza | tacos | pasta"); });
  simple("wouldyourather", "Get a would-you-rather question.", () => "🤔 " + pick(["Would you rather explore space or the deep ocean?", "Would you rather have a tiny dragon or a friendly robot?", "Would you rather instantly learn any language or any instrument?", "Would you rather live in a treehouse or a houseboat?"]));
  simple("thisorthat", "Get a this-or-that choice.", () => pick(["🌅 Sunrise or 🌇 sunset?", "🎮 Games or 🎨 art?", "🍕 Pizza or 🌮 tacos?", "🏖️ Beach or 🏔️ mountains?"]));
  simple("yesno", "Answer a yes-or-no question.", () => pick(["Yes! ✅", "Nope! ❌", "Maybe! 🤔", "Absolutely! 🌟", "Not today! 😅"]));
  simple("coin", "Flip a virtual coin for fun (not betting).", () => "🪙 " + pick(["Heads!", "Tails!"]));
  simple("magic", "Get a random magical response.", () => pick(["✨ The stars say: keep creating.", "🪄 Poof! Your day just got 10% more magical.", "🔮 The crystal ball is buffering…", "🌟 A surprise idea is on its way."]));
  add("nickname", "Generate a silly nickname.", (msg) => msg.reply("🏷️ Your nickname: **" + pick(["Captain Noodle", "Pixel Wizard", "The Snack Architect", "Turbo Pancake", "Cloud Collector", "Sir Debugs-a-Lot"]) + "**"));
  simple("secret", "Reveal a harmless random secret.", () => pick(["The moon is just showing off.", "Somewhere, a keyboard misses its space bar.", "Your fridge light has the best private concert venue.", "A rubber duck is an underrated debugging assistant."]));
  simple("mood", "Get a random mood.", () => "Today's mood: " + pick(["😎 Chill", "⚡ Energetic", "🧠 Curious", "🌱 Peaceful", "🎉 Celebratory", "🛠️ Productive"]));
  add("story", "Create a tiny random story.", (msg) => msg.reply("📖 " + pick(["A tiny robot found a map, followed it, and discovered a library full of unfinished inventions.", "A sleepy dragon opened a bakery and accidentally invented spicy cupcakes.", "A space cat pressed one button and became captain of a very confused spaceship."])));
  add("madlibs", "Make a silly mini Mad Lib.", (msg) => { const words = clean(msg.args).split(/\s+/).filter(Boolean); msg.reply("📝 " + (words.length >= 3 ? `The ${words[0]} ${words[1]}ed into a ${words[2]} and shouted, “WHAT?!”` : "Usage: /madlibs adjective verb noun")); });
  simple("twister", "Get a tongue twister.", () => pick(["She sells seashells by the seashore.", "Red lorry, yellow lorry.", "Six slippery snails slid slowly seaward.", "A proper copper coffee pot."]));
  simple("alphabet", "Get the alphabet.", () => "🔤 ABCDEFGHIJKLMNOPQRSTUVWXYZ");
  add("acronym", "Turn a word into a silly acronym.", (msg) => { const w = clean(msg.args).replace(/\s+/g, "").toUpperCase(); msg.reply(w ? w.slice(0, 18).split("").map(ch => ch + " — " + pick(["Awesome", "Brilliant", "Creative", "Daring", "Excellent", "Fantastic"])).join("\n") : "Usage: /acronym WORD"); });

  add("trivia", "Get a trivia question and answer.", (msg) => { const q = pick(trivia); msg.reply("🧠 " + q[0] + "\nAnswer: ||" + q[1] + "||"); });
  add("riddle", "Get a riddle with its answer hidden.", (msg) => { const r = pick(riddles); msg.reply("🧩 " + r[0] + "\nAnswer: ||" + r[1] + "||"); });
  add("scramble", "Get a scrambled word to solve.", (msg) => { const word = pick(["planet", "puzzle", "orange", "guitar", "rocket", "garden"]); const scrambled = word.split("").sort(() => Math.random() - 0.5).join(""); msg.reply("🔤 Unscramble: **" + scrambled + "**"); });
  add("guessnumber", "Play a number guessing mini-game.", (msg) => { msg.reply("🔢 I picked a demo number from 1–10. Try /guess 7 to test the sample round!"); });
  add("guess", "Check a number against a sample number.", (msg) => { const n = Number(msg.args); msg.reply(Number.isInteger(n) && n >= 1 && n <= 10 ? (n === 7 ? "🎉 Correct! The sample number was 7." : "Not this time! The sample number is 7. Try again.") : "Usage: /guess 1-10"); });
  add("mathquiz", "Get a quick math question.", (msg) => { const a = randomInt(2, 13), b = randomInt(2, 13); msg.reply(`➗ What is ${a} × ${b}? Answer: ||${a * b}||`); });
  simple("truefalse", "Get a true-or-false fact.", () => pick(["True or false: Octopuses have three hearts. Answer: ||True||", "True or false: The Sun is a planet. Answer: ||False||", "True or false: A hexagon has six sides. Answer: ||True||"]));
  simple("oddoneout", "Find the odd one out.", () => "🧩 Which is the odd one out: **cat, dog, carrot, rabbit**? Answer: ||carrot||");
  simple("emojiquiz", "Guess the movie or phrase from emojis.", () => pick(["🎈🏠 — Answer: ||Up||", "🦁👑 — Answer: ||The Lion King||", "❄️👸 — Answer: ||Frozen||", "🐠🔍 — Answer: ||Finding Nemo||"]));
  simple("memory", "Try this quick memory challenge.", () => "🧠 Memorize this: **🍎 🚀 🐸 🌙 🎸**. Now look away and see if you remember all five!");
  simple("wordchain", "Start a word-chain game.", () => "🔗 Word chain: start with **APPLE**. Your next word should begin with the last letter: **E**!");
  simple("anagram", "Get an anagram challenge.", () => "🔤 Unscramble **TCA**. Answer: ||CAT||");
  simple("quickquiz", "Get a quick general-knowledge quiz.", () => "❓ How many minutes are in one hour? Answer: ||60||");
  simple("finishstory", "Get a story starter.", () => "✍️ Finish this: “The mysterious package on the doorstep began to glow, and then…”");
  simple("challenge", "Get a harmless creative challenge.", () => pick(["Draw a robot using only circles and squares.", "Invent a name for a new planet.", "Write a story in exactly five words.", "Describe your favorite game without naming it."]));
  simple("brainbreak", "Get a quick brain break prompt.", () => pick(["Name five things that are blue.", "Think of three ways to reuse an empty box.", "Try to name an animal for every letter you can.", "Take a moment to stretch comfortably and rest your eyes."]));

  const textInput = (msg, usage, fn) => { const value = clean(msg.args); msg.reply(value ? truncate(fn(value)) : usage); };
  add("reverse", "Reverse your text.", (msg) => textInput(msg, "Usage: /reverse hello", s => [...s].reverse().join("")));
  add("uppercase", "Convert text to uppercase.", (msg) => textInput(msg, "Usage: /uppercase hello", s => s.toUpperCase()));
  add("lowercase", "Convert text to lowercase.", (msg) => textInput(msg, "Usage: /lowercase HELLO", s => s.toLowerCase()));
  add("titlecase", "Convert text to title case.", (msg) => textInput(msg, "Usage: /titlecase hello world", s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())));
  add("wordcount", "Count words in your text.", (msg) => textInput(msg, "Usage: /wordcount your text", s => "📝 Words: " + (s.match(/\S+/g) || []).length));
  add("charcount", "Count characters in your text.", (msg) => textInput(msg, "Usage: /charcount your text", s => "🔠 Characters: " + s.length));
  add("repeat", "Repeat text up to three times.", (msg) => { const s = clean(msg.args); msg.reply(s ? truncate(Array( Math.min(3, Math.max(1, Number(msg.argv?.[0]) || 2))).fill(msg.argv?.slice(1).join(" ") || s).join(" ")) : "Usage: /repeat text"); });
  add("mockcase", "Convert text to alternating case.", (msg) => textInput(msg, "Usage: /mockcase hello there", s => [...s].map((c,i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join("")));
  add("claptext", "Put claps between words.", (msg) => textInput(msg, "Usage: /claptext hello world", s => s.split(/\s+/).join(" 👏 ")));
  add("binary", "Convert text to binary.", (msg) => textInput(msg, "Usage: /binary hi", s => [...s].map(c => c.charCodeAt(0).toString(2).padStart(8,"0")).join(" ").slice(0, 850)));
  add("initials", "Get the initials from a phrase.", (msg) => textInput(msg, "Usage: /initials hello world", s => s.split(/\s+/).map(w => w[0]).join("").toUpperCase()));
  add("vowels", "Count vowels in text.", (msg) => textInput(msg, "Usage: /vowels hello", s => "Vowels: " + (s.match(/[aeiou]/gi) || []).length));
  add("consonants", "Count consonants in text.", (msg) => textInput(msg, "Usage: /consonants hello", s => "Consonants: " + (s.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length));
  add("hashtag", "Turn text into a hashtag.", (msg) => textInput(msg, "Usage: /hashtag my cool project", s => "#" + s.replace(/[^a-z0-9]+/gi, "").slice(0, 60)));
  add("quoteformat", "Format your text as a quote.", (msg) => textInput(msg, "Usage: /quoteformat words to remember", s => "💬 “" + s + "”"));

  simple("date", "Show today's date in UTC.", () => "📅 " + new Date().toISOString().slice(0, 10) + " (UTC)");
  simple("utc", "Show the current UTC time.", () => "🕒 " + new Date().toISOString().slice(11, 19) + " UTC");
  simple("timestamp", "Show the current Unix timestamp.", () => "⏱️ " + Math.floor(Date.now() / 1000));
  add("serverid", "Show the current server ID.", (msg) => msg.reply(msg.server_id ? "🏠 Server ID: " + msg.server_id : "Use this command inside a server."));
  add("userid", "Show your account ID.", (msg) => msg.reply("👤 Your user ID: " + (msg.author_id ?? "Unavailable")));
  simple("botinfo", "Show Hi Bot information.", () => "🤖 **Hi Bot**\nA fun community bot for Yapper.\nTry /commands to explore its extra commands.");
  add("suggest", "Send a feature suggestion in the current channel.", (msg) => { const s = clean(msg.args); msg.reply(s ? "💡 Suggestion noted in this channel: " + truncate(s, 500) : "Usage: /suggest your idea"); });
  add("feedback", "Share feedback about Hi Bot.", (msg) => { const s = clean(msg.args); msg.reply(s ? "📝 Thanks for the feedback! This command displays it here; it does not send it to a private inbox.\n" + truncate(s, 500) : "Usage: /feedback your feedback"); });
}
