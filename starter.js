import { Bot } from "./yapper.js";
import { randomInt } from "node:crypto";

// ========================================
// HI BOT — CONFIGURATION
// ========================================

const TOKEN = process.env.YAPPER_TOKEN;

if (!TOKEN) {
  console.error("ERROR: The YAPPER_TOKEN environment variable is missing.");
  process.exit(1);
}

const bot = new Bot(TOKEN);

const jokes = [
  "Why did the computer get cold? It left its Windows open.",
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "Why was the math book sad? It had too many problems.",
  "Why did the developer go broke? They used up all their cache.",
  "What do you call a computer that sings? A Dell."
];

const eightBallAnswers = [
  "🎱 Absolutely!",
  "🎱 Definitely!",
  "🎱 It looks promising.",
  "🎱 Probably!",
  "🎱 Ask again later.",
  "🎱 The answer is unclear.",
  "🎱 Probably not.",
  "🎱 Definitely not!"
];

function reply(msg, content) {
  return msg.reply(content);
}

function getUsername(msg) {
  return msg.author?.username ?? msg.author?.name ?? String(msg.author ?? "Unknown");
}

// ========================================
// CORE FUN COMMANDS
// ========================================

bot.command("ping", "Check whether Hi Bot is online.", (msg) => {
  reply(msg, "🏓 PONG! Hi Bot is online and ready for fun!");
});

bot.command("help", "Show the fun command categories.", (msg) => {
  reply(msg, [
    "🎉 HI BOT — FUN COMMANDS",
    "",
    "🎲 Games: /8ball /roll /coinflip /trivia /riddle /scramble /mathquiz /emojiquiz /guessnumber /guess",
    "🤣 Random fun: /joke /roast /compliment /fact /fortune /vibe /nickname /memeidea /headline /bandname",
    "🪩 Party: /dance /dancebattle /wouldyourather /thisorthat /votefun /duel /bossfight /treasure",
    "🐾 Creatures: /animal /pet /petmood /monster /alienname /superpower",
    "✨ Creativity: /story /plot /quest /scenario /catchphrase /randomchallenge /mysterybox",
    "",
    "Use /commands to see the full extra command list!"
  ].join("\n"));
});

bot.command("8ball", "Ask the magic 8-ball a question.", (msg) => {
  const question = String(msg.args ?? "").trim();
  if (!question) {
    reply(msg, "🎱 Ask me a question! Example: /8ball Will I win?");
    return;
  }
  reply(msg, eightBallAnswers[randomInt(eightBallAnswers.length)]);
});

bot.command("roll", "Roll a die with a chosen number of sides.", (msg) => {
  const sides = Number(msg.argv?.[0] ?? "6");
  if (!Number.isInteger(sides) || sides < 2 || sides > 1000) {
    reply(msg, "🎲 Choose a whole number of sides between 2 and 1000.");
    return;
  }
  reply(msg, `🎲 You rolled **${randomInt(1, sides + 1)}** on a ${sides}-sided die!`);
});

bot.command("coinflip", "Flip a virtual coin.", (msg) => {
  reply(msg, "🪙 The coin landed on **" + (randomInt(2) === 0 ? "Heads" : "Tails") + "**!");
});

bot.command("joke", "Tell a random joke.", (msg) => {
  reply(msg, "😂 " + jokes[randomInt(jokes.length)]);
});

// ========================================
// EVENTS
// ========================================

bot.on("member_join", (event) => {
  console.log("Member joined:", event);
});

bot.on("message", (msg) => {
  if (msg.mentioned) {
    reply(msg, `👋 Hey ${getUsername(msg)}! I'm Hi Bot. Try /help or /commands!`);
  }
});

bot.on("ready", (me) => {
  console.log(`🤖 Hi Bot is online as ${me.username ?? "Unknown"}!`);
});

bot.on("error", (error) => {
  console.error("❌ Hi Bot encountered an error:", error);
});

// Load the fun command pack.
await bot.load("./cogs/extras.js");

try {
  await bot.start();
} catch (error) {
  console.error("❌ Hi Bot failed to start:", error);
  process.exitCode = 1;
}
