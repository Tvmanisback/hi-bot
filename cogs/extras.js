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

  simple("newhelp", "Show the fun command categories.", [
    "🎉 HI BOT — FUN COMMANDS",
    "Random fun: /compliment /roast /fact /quote /motivate /fortune /vibe /hype /joke2 /pun /dadjoke /clap /emoji /emojify /randomemoji /randomcolor /choose /wouldyourather /thisorthat /yesno /magic /nickname /secret /mood",
    "Games: /trivia /riddle /scramble /guessnumber /guess /mathquiz /truefalse /oddoneout /emojiquiz /memory /wordchain /anagram /quickquiz /finishstory /challenge /brainbreak /quizme",
    "Party: /animal /pet /dance /scenario /award /superpower /alienname /petmood /rate /luck /weather /headline /bandname /planet /monster /excuse /complaint /plot /quest /catchphrase /sound /dancebattle /bossfight /treasure /randomchallenge /votefun /shipname /duel /emojiweather /mysterybox",
    "Creative: /story /madlibs /twister /alphabet /acronym",
    "Use /commands for the full list."
  ].join("\n"));

  add("commands", "List the fun command collection.", (msg) => msg.reply([
    "🎊 HI BOT — FUN COMMANDS",
    "Random: /compliment /roast /fact /quote /motivate /fortune /vibe /hype /joke2 /pun /dadjoke /clap /emoji /emojify /randomemoji /randomcolor /choose /wouldyourather /thisorthat /yesno /magic /nickname /secret /mood /fortune2",
    "Games: /trivia /riddle /scramble /guessnumber /guess /mathquiz /truefalse /oddoneout /emojiquiz /memory /wordchain /anagram /quickquiz /finishstory /challenge /brainbreak /quizme",
    "Party: /animal /pet /dance /scenario /award /superpower /alienname /petmood /rate /luck /weather /headline /bandname /planet /monster /excuse /complaint /plot /quest /catchphrase /sound /dancebattle /bossfight /treasure /randomchallenge /votefun /shipname /duel /emojiweather /mysterybox",
    "Creative: /story /madlibs /twister /alphabet /acronym",
    "No moderation clutter. Just fun. 🎉"
  ].join("\n"));

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


  // More party games and silly commands
  const animals = ["🦊 Fox", "🐼 Panda", "🦦 Otter", "🦉 Owl", "🐸 Frog", "🦖 Dinosaur", "🦋 Butterfly", "🦝 Raccoon"];
  const pets = ["Pixel the dragon", "Sir Waffles the cat", "Bubbles the axolotl", "Noodle the penguin", "Mochi the puppy"];
  const dances = ["🕺 The robot", "💃 The moonwalk", "🪩 The disco shuffle", "🤸 The spaghetti noodle", "🦆 The wobbly duck"];
  const scenarios = ["You wake up and discover your toaster can talk. What does it say?", "A penguin hands you a mysterious key. What do you unlock?", "You find a tiny door in a tree. Do you open it?", "Your backpack starts giving you life advice. What's its first tip?", "A friendly alien asks you to explain pizza. How do you describe it?"];
  const fortunes = ["A surprise laugh is approaching.", "Your next idea will be delightfully weird.", "A tiny victory is still a victory.", "The snack you seek is closer than you think.", "Your future contains excellent playlists."];

  simple("animal", "Get a random animal.", () => "🐾 Your animal: " + pick(animals));
  simple("pet", "Adopt a random imaginary pet.", () => "🏡 You adopted **" + pick(pets) + "**! Give your new pal a name.");
  simple("dance", "Pick a ridiculous dance move.", () => "🪩 Dance move: " + pick(dances));
  simple("scenario", "Get a random silly scenario.", () => "🎬 " + pick(scenarios));
  simple("award", "Receive a completely random award.", () => "🏆 You have won: **" + pick(["Most Likely to Befriend an Alien", "Professional Snack Tester", "CEO of Random Ideas", "Legendary Button Presser", "World Champion of Procrastinating"]) + "**!");
  simple("superpower", "Get a questionable superpower.", () => "🦸 Your superpower is " + pick(["teleporting exactly three feet", "talking to pigeons", "summoning one slice of pizza", "perfectly guessing the weather", "making elevators play entrance music"]) + "!");
  simple("alienname", "Generate a goofy alien name.", () => "👽 Your alien name is **" + pick(["Zorp", "Muffin", "Captain Pickles", "Galaxy Bean", "Sir Bloop", "Waffletron"]) + "**.");
  simple("fortune2", "Get another silly fortune.", () => "🥠 " + pick(fortunes));
  simple("petmood", "Find out your imaginary pet's mood.", () => pick(["🐾 Your pet is zooming around.", "🐾 Your pet demands snacks.", "🐾 Your pet is taking a very important nap.", "🐾 Your pet has chosen chaos today."]));
  simple("rate", "Rate something out of 10.", (msg) => "⭐ " + randomInt(1, 11) + "/10 for " + (clean(msg.args) || "your vibe") + "!");
  simple("luck", "Check your totally scientific luck level.", () => "🍀 Luck level: **" + randomInt(1, 101) + "%**");
  simple("weather", "Get a pretend weather forecast.", () => "🌦️ Forecast: " + pick(["100% chance of snacks.", "Cloudy with a chance of dragons.", "Sunny with scattered confetti.", "Thunderstorms of pure excitement.", "A gentle breeze of good vibes."]) + " (just for fun!)");
  simple("headline", "Generate a silly breaking-news headline.", () => "📰 BREAKING: " + pick(["Local potato elected mayor.", "Tiny dragon opens a pancake shop.", "Pigeons announce a new space program.", "Mysterious socks form a union.", "The moon requests a vacation."]));
  simple("bandname", "Generate a random band name.", () => "🎸 Your band name: **" + pick(["The Neon Pickles", "Cosmic Toast", "The Sleepy Meteors", "Waffle Radio", "Laser Hamsters", "Midnight Pigeons"]) + "**");
  simple("planet", "Generate a silly planet to visit.", () => "🪐 Welcome to **" + pick(["Pancakia", "Bloopiter", "Snackron", "Wafflestar", "Frogtopia"]) + "**. Local currency: " + pick(["buttons", "marshmallows", "shiny rocks", "tiny hats"]) + ".");
  simple("monster", "Invent a friendly monster.", () => "👾 Meet **" + pick(["Fluffernox", "Glimbo", "Munchlet", "Boopzilla", "Crumb Goblin"]) + "**! It loves " + pick(["pancakes", "music", "collecting rocks", "bubble baths", "video games"]) + ".");
  simple("excuse", "Generate a ridiculous harmless excuse.", () => "😅 " + pick(["My imaginary penguin needed technical support.", "A cloud challenged me to a staring contest.", "My socks were having a meeting.", "I got distracted naming a houseplant.", "The calendar said it was a snack emergency."]));
  simple("complaint", "Make a silly complaint about the universe.", () => "📣 " + pick(["Why do chargers disappear exactly when you need them?", "Who gave mosquitoes permission to exist?", "Why is the last slice always so dramatic?", "Can someone tell Mondays to calm down?"]));
  simple("plot", "Generate a random movie plot.", () => "🎥 " + pick(["A retired wizard becomes a school bus driver.", "A group of squirrels starts a detective agency.", "A robot enters a baking competition.", "A lost astronaut opens a tiny coffee shop on Mars."]));
  simple("quest", "Receive a harmless mini quest.", () => "🗺️ QUEST: " + pick(["Find something shaped like a star.", "Invent a superhero name for a household object.", "Draw your dream spaceship.", "Think of three names for a pet dragon.", "Make up a new holiday."]));
  simple("catchphrase", "Get a random catchphrase.", () => "🎤 " + pick(["That's how the waffle crumbles!", "To the moon and extra cheese!", "Stay frosty, tiny potato!", "Big brain, small sandwich!", "Beep beep, legendary mode!"]));
  simple("sound", "Get a random sound effect.", () => pick(["💥 KABOOM!", "✨ POOF!", "🐸 Ribbit!", "🚀 WHOOSH!", "🔔 DING!", "🦆 QUACK!"]));
  simple("dancebattle", "Start a pretend dance battle.", () => "🪩 DANCE BATTLE! " + pick(["Team Robot", "Team Disco", "Team Wobbly Duck"]) + " takes the first turn. Your move!");
  simple("bossfight", "Face a silly imaginary boss.", () => "⚔️ A wild **" + pick(["Mega Broccoli", "The Homework Hydra", "Lord Lag", "The Sock Gobbler", "King Buffering"]) + "** appears! Your special move is **" + pick(["Mega Bonk", "Confetti Blast", "The Wiggle", "Snack Shield"]) + "**!");
  simple("treasure", "Find imaginary treasure.", () => "💎 You discovered " + pick(["a golden rubber duck", "the legendary cheesy crown", "a chest full of tiny hats", "an enchanted game controller", "one million invisible coins"]) + "!");
  simple("randomchallenge", "Get a random silly challenge.", () => "🎯 " + pick(["Describe a potato like it's a luxury product.", "Invent a new emoji and explain it.", "Name five fictional pizza toppings.", "Create a superhero whose power is mildly inconvenient.", "Write a two-sentence story about a talking shoe."]));
  simple("votefun", "Get a silly either-or vote prompt.", () => "📊 Vote: " + pick(["Dragons 🐉 or dinosaurs 🦖?", "Pancakes 🥞 or waffles 🧇?", "Space 🚀 or deep sea 🌊?", "Cats 🐈 or raccoons 🦝?"]) + " Reply with your pick!");
  add("shipname", "Combine two names into a silly team name.", (msg) => { const parts = clean(msg.args).split(/\s+/).filter(Boolean); msg.reply(parts.length >= 2 ? "🤝 Team name: **" + (parts[0].slice(0, Math.ceil(parts[0].length/2)) + parts[1].slice(Math.floor(parts[1].length/2))).slice(0,40) + "**" : "Usage: /shipname name1 name2"); });
  simple("duel", "Run a harmless random duel.", (msg) => "🥊 " + (clean(msg.args) || "You") + " challenges " + pick(["a giant marshmallow", "a confused goose", "a wizard frog", "a sentient toaster"]) + "! Winner: " + pick(["You", "The marshmallow", "Nobody; they became friends"]) + "!");
  simple("quizme", "Get a quick question with a hidden answer.", () => { const q = pick(trivia); return "🎓 " + q[0] + "\n||Answer: " + q[1] + "||"; });
  simple("emojiweather", "Get a random emoji forecast.", () => "🌤️ " + pick(["☀️🌈", "🌧️🐸", "⛈️⚡", "❄️🧣", "🌪️🌀", "🌅✨"]));
  simple("mysterybox", "Open a mystery box.", () => "📦 You opened the mystery box and found: **" + pick(["a tiny crown", "a dancing cactus", "a portal to Waffle Land", "a shiny pebble", "a rubber chicken", "a very polite ghost"]) + "**!");

}
