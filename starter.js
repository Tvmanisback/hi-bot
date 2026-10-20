import { Bot } from "./yapper.js";
import { randomInt } from “node:crypto”;
import { existsSync, readFileSync, writeFileSync } from “node:fs”;

// ========================================
// HI BOT — CONFIGURATION
// ========================================

const TOKEN = process.env.YAPPER_TOKEN;

if (!TOKEN) {
console.error(“ERROR: The YAPPER_TOKEN environment variable is missing.”);
process.exit(1);
}

const bot = new Bot(TOKEN);

// ========================================
// DATA
// ========================================

const WARNINGS_FILE = “./warnings.json”;

let warnings = {};

if (existsSync(WARNINGS_FILE)) {
try {
warnings = JSON.parse(readFileSync(WARNINGS_FILE, “utf8”));
} catch {
console.error(“Could not read warnings.json. Starting with empty warnings.”);
warnings = {};
}
}

function saveWarnings() {
writeFileSync(WARNINGS_FILE, JSON.stringify(warnings, null, 2));
}

function warningKey(serverId, userId) {
return ${serverId}:${userId};
}

const jokes = [
“Why did the computer get cold? It left its Windows open.”,
“Why do programmers prefer dark mode? Because light attracts bugs.”,
“Why was the math book sad? It had too many problems.”,
“Why did the developer go broke? They used up all their cache.”,
“What do you call a computer that sings? A Dell.”
];

const eightBallAnswers = [
“🎱 Absolutely!”,
“🎱 Definitely!”,
“🎱 It looks promising.”,
“🎱 Probably!”,
“🎱 Ask again later.”,
“🎱 The answer is unclear.”,
“🎱 Probably not.”,
“🎱 Definitely not!”
];

// ========================================
// HELPERS
// ========================================

function reply(msg, content) {
return msg.reply(content);
}

function getServerId(msg) {
return msg.server_id ?? null;
}

function getUserId(msg) {
return msg.author_id ?? null;
}

function getUsername(msg) {
return msg.author?.username ?? msg.author?.name ?? String(msg.author ?? “Unknown”);
}

function requireServer(msg) {
if (!getServerId(msg)) {
reply(msg, “❌ This command must be used inside a server.”);
return false;
}

return true;
}

// ========================================
// GENERAL COMMANDS
// ========================================

bot.command(“ping”, “Check whether Hi Bot is online.”, (msg) => {
reply(msg, “🏓 Pong! Hi Bot is online!”);
});

bot.command(“help”, “Display the Hi Bot command list.”, (msg) => {
reply(
msg,
[
“🤖 HI BOT — COMMANDS”,
“”,
“🎉 Fun”,
“/8ball <question> — Ask the magic 8-ball.”,
“/roll [sides] — Roll a die.”,
“/coinflip — Flip a coin.”,
“/joke — Get a random joke.”,
“”,
“🧰 Utilities”,
“/userinfo — View your user information.”,
“/serverinfo — View server information.”,
“/poll <question> — Create a text poll.”,
“”,
“🛡️ Moderation demonstrations”,
“/warn <user_id> [reason] — Record a warning.”,
“/warnings <user_id> — View recorded warnings.”,
“/clearwarnings <user_id> — Clear recorded warnings.”,
“”,
“🔧 General”,
“/ping — Check bot status.”,
“/help — Display this message.”
].join(”\n”)
);
});

// ========================================
// FUN COMMANDS
// ========================================

bot.command(“8ball”, “Ask the magic 8-ball a question.”, (msg) => {
const question = String(msg.args ?? “”).trim();

if (!question) {
reply(msg, “🎱 Ask me a question! Example: /8ball Will I win?”);
return;
}

const answer = eightBallAnswers[randomInt(eightBallAnswers.length)];

reply(msg, answer);
});

bot.command(“roll”, “Roll a die with a chosen number of sides.”, (msg) => {
const rawSides = msg.argv?.[0] ?? “6”;
const sides = Number(rawSides);

if (!Number.isInteger(sides) || sides < 2 || sides > 1000) {
reply(msg, “❌ Choose a whole number of sides between 2 and 1000.”);
return;
}

const result = randomInt(1, sides + 1);

reply(msg, 🎲 You rolled **${result}** on a ${sides}-sided die!);
});

bot.command(“coinflip”, “Flip a virtual coin.”, (msg) => {
const result = randomInt(2) === 0 ? “Heads” : “Tails”;

reply(msg, 🪙 The coin landed on **${result}**!);
});

bot.command(“joke”, “Tell a random joke.”, (msg) => {
const joke = jokes[randomInt(jokes.length)];

reply(msg, 😂 ${joke});
});

// ========================================
// USER INFORMATION
// ========================================

bot.command(“userinfo”, “Show your available user information.”, (msg) => {
const username = getUsername(msg);
const userId = getUserId(msg);

reply(
msg,
[
“👤 USER INFORMATION”,
Username: ${username},
User ID: ${userId ?? "Unavailable"}
].join(”\n”)
);
});

// ========================================
// SERVER INFORMATION
// ========================================

bot.command(“serverinfo”, “Show information about this server.”, async (msg) => {
if (!requireServer(msg)) return;

const serverId = getServerId(msg);

try {
const server = await bot.server(serverId);

reply(
  msg,
  [
    "🏠 **SERVER INFORMATION**",
    `Name: ${server.name ?? "Unknown"}`,
    `Server ID: ${serverId}`
  ].join("\n")
);

} catch (error) {
console.error(“Server information error:”, error);

reply(
  msg,
  "❌ I couldn't retrieve server information. Check the SDK's server lookup API."
);

}
});

// ========================================
// POLLS
// ========================================

bot.command(“poll”, “Create a text-based yes-or-no poll.”, (msg) => {
const question = String(msg.args ?? “”).trim();

if (!question) {
reply(msg, “Usage: /poll Should we play a game?”);
return;
}

if (question.length > 1500) {
reply(msg, “❌ Please keep poll questions under 1500 characters.”);
return;
}

reply(
msg,
[
“📊 POLL”,
question,
“”,
“👍 Yes”,
“👎 No”,
“”,
“This is a text poll. Interactive voting requires Yapper’s supported reaction or component API.”
].join(”\n”)
);
});

// ========================================
// MODERATION DEMONSTRATIONS
// ========================================

// IMPORTANT:
// These commands only manage Hi Bot’s local warning records.
// They do not ban, kick, timeout, or otherwise moderate Yapper users.
//
// Before using these commands in a real server, implement and verify
// Yapper’s actual moderator permission checks and user-ID handling.

bot.command(“warn”, “Record a demonstration warning.”, (msg) => {
if (!requireServer(msg)) return;

const input = String(msg.args ?? “”).trim();
const parts = input.split(/\s+/);
const userId = parts.shift();
const reason = parts.join(” “) || “No reason provided”;

if (!userId || userId.length > 100) {
reply(msg, “Usage: /warn USER_ID [reason]”);
return;
}

const key = warningKey(getServerId(msg), userId);

if (!warnings[key]) {
warnings[key] = [];
}

warnings[key].push({
reason,
moderator: getUserId(msg) ?? getUsername(msg),
createdAt: new Date().toISOString()
});

try {
saveWarnings();
} catch (error) {
console.error(“Could not save warnings:”, error);

reply(msg, "❌ I couldn't save the warning to disk.");
return;

}

reply(
msg,
[
“⚠️ DEMONSTRATION WARNING RECORDED”,
User ID: ${userId},
Reason: ${reason},
Total warnings: ${warnings[key].length},
“”,
“This prototype does not verify moderator permissions.”
].join(”\n”)
);
});

bot.command(“warnings”, “View demonstration warnings for a user.”, (msg) => {
if (!requireServer(msg)) return;

const userId = msg.argv?.[0];

if (!userId) {
reply(msg, “Usage: /warnings USER_ID”);
return;
}

const key = warningKey(getServerId(msg), userId);
const userWarnings = warnings[key] ?? [];

if (userWarnings.length === 0) {
reply(msg, ✅ No recorded warnings for ${userId}.);
return;
}

const lines = userWarnings.map((warning, index) => {
return [
${index + 1}. ${warning.reason},
   Moderator: ${warning.moderator},
   Date: ${warning.createdAt}
].join(”\n”);
});

reply(
msg,
[
⚠️ **WARNINGS FOR ${userId}**,
“”,
…lines
].join(”\n”).slice(0, 1900)
);
});

bot.command(“clearwarnings”, “Clear demonstration warnings for a user.”, (msg) => {
if (!requireServer(msg)) return;

const userId = msg.argv?.[0];

if (!userId) {
reply(msg, “Usage: /clearwarnings USER_ID”);
return;
}

const key = warningKey(getServerId(msg), userId);

if (!warnings[key]) {
reply(msg, No warnings were recorded for ${userId}.);
return;
}

delete warnings[key];

try {
saveWarnings();
} catch (error) {
console.error(“Could not save warning changes:”, error);

reply(msg, "❌ I couldn't save the changes to disk.");
return;

}

reply(msg, 🧹 Cleared demonstration warnings for ${userId}.);
});

// ========================================
// WELCOME EVENTS
// ========================================

// This logs join events while we verify Yapper’s actual event schema.
// Configure a welcome channel and send a message only after confirming
// the SDK’s supported event fields and channel-message API.

bot.on(“member_join”, (event) => {
console.log(“Member joined:”, event);
});

// ========================================
// MESSAGE EVENTS
// ========================================

// Verify the actual message-event schema before relying on this handler.

bot.on(“message”, (msg) => {
if (msg.mentioned) {
reply(msg, 👋 Hey ${getUsername(msg)}! I'm Hi Bot. Try /help!);
}
});

// ========================================
// CONNECTION EVENTS
// ========================================

bot.on(“ready”, (me) => {
console.log(🤖 Hi Bot is online as ${me.username ?? "Unknown"}!);
});

bot.on(“error”, (error) => {
console.error(“❌ Hi Bot encountered an error:”, error);
});

// ========================================
// START BOT
// ========================================

try {
await bot.start();
} catch (error) {
console.error(“❌ Hi Bot failed to start:”, error);
process.exitCode = 1;
}
