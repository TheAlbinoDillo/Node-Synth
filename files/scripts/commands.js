"use strict";

const Discord = require("discord.js");
const FileSystem = require("fs");
const MathJS = require("mathjs");
const Tools = require("./botTools.js");

const Prefix = 'fg.';

class Responce {
	constructor(type = "text", content, guild, channel, message) {
		let types = ["text", "edit", "react", "ping", "transpose"];
		if (!types.includes(type) ) {
			console.error("Responce type not valid.\n");
			return null;
		}

		this.type = type,
		this.content = content,
		this.guild = guild,
		this.channel = channel,
		this.message = message
	}
}

class TextMessage extends Responce {
	constructor(message, content) {
		super
		(
			"text",
			content,
			message.guild,
			message.channel,
			message
		);
	}
}

class Transpose extends Responce {
	constructor(content, guild, channel) {
		super
		(
			"transpose",
			content,
			guild,
			channel,
			null
		);
	}
}

class PingMessage extends Responce {
	constructor(message, content) {
		super
		(
			"ping",
			content,
			message.guild,
			message.channel,
			message
		);
	}
}

class ReactEmote extends Responce {
	constructor(message, emote) {
		super
		(
			"react",
			emote,
			message.guild,
			message.channel,
			message
		);
	}
}

class Usage {
	constructor(label,  test) {
		this.label = label,
		this.test = test
	}
}

class UsageString extends Usage {
	constructor(label, options = []) {
		super
		(
			label,
			function (arg) {
				if (typeof arg === 'string' || arg instanceof String) {
					return options.length > 0 ? options.includes(arg) : true;
				} else {
					return null;
				}	
			}
		);
		this.options = options;
	}
}

class UsageNumber extends Usage {
	constructor(label, min = 0, max = Infinity) {
		super
		(
			label,
			function (arg) {
				arg = parseInt(arg);
				let typetest = typeof arg === 'number' || arg instanceof Number;
				let rangeTest = arg >= min && arg <= max;

				if (typetest && rangeTest) {
					return arg;
				} else {
					return null;
				}	
			}
		);
	}
}

class Command {
	constructor(name, runFunction = function () {}, description = "", category, usage = [], deleteMessage = false, permissions = [], calls = []) {
		this.name = name;
		this.runFunction = runFunction;
		this.description = description;
		this.category = category ? category : "unlisted";
		this.usage = usage;
		this.deleteMessage = deleteMessage;
		this.permissions = permissions;
		this.calls = calls + [name.toLowerCase().replace(/ /g, "")]
	}
}

class Interaction extends Command {
	constructor(name, description, outputs, calls = [], defaultWord = "themselves") {
		super
		(
			name,
			function (message, args)
			{
				let arr = Tools.arrayIntoList(Tools.getMentionList(message, true) ) || defaultWord;
				let picks = this.outputs;

				let text = `${Tools.serverName(message.author, message.guild)}${Tools.randArray(picks[0])} ${Tools.randArray(picks[1])} ${arr}${Tools.randArray(picks[2])}`;
				return text;
			},
			description = description,
			"interactions",
			["@user1 @user2 @user.."],
			false,
			[],
			calls
		);
		this.outputs = outputs;
	}
}

class ImageShare extends Command {
	constructor(name, type = ".png", filename) {

		filename = filename || name.toLowerCase();

		super
		(
			name,
			function (message, args) {
				let pickLength = FileSystem.readdirSync(`./files/common/${filename}/`).length;
				let choice = parseInt(args[0]);
				let pick = Tools.randNumber(pickLength - 1);

				let url = `./files/common/${filename}/${filename}${pick}${type}`;
				let content = {content: pick, files: [url]};

				if (args[0]) {
					let returnList =
						[
							new ReactEmote(message, "🔍"),
							new TextMessage(message, content)
						];

					if (choice >= 0 && choice < pickLength) {

						pick = choice;
						url = `./files/common/${filename}/${filename}${pick}${type}`;
						content = {content: pick, files: [url]};
						returnList[1] = new TextMessage(message, content);

						return returnList;
					} else {
						returnList.push(new ReactEmote(message, "❔") );
						return returnList;
					}
				}

				return new TextMessage(message, content);
			},
			`Get ${filename} pictures!`,
			"fun",
			[new UsageNumber("rolls")],
			false,
			[]
		);
	}
}

var commandCategoryList = new Array();
const commandList =
[
	new Command("Help", helpCommand, "Get help"),

	new Interaction("Hug", "Give someone a hug!",
		[
			["", " quickly", " happily"],
			["gives a hug to", "hugs"],
			["!", ", how nice!", ", awwww."]
		]
	),

	new Interaction("Cuddle", "Cuddle up with someone!",
		[
			[" cozily", " warmly"],
			["cuddles"],
			["!"]
		], ["cudd"]
	),

	new Interaction("Snuddle", "Snuddle with someone!",
		[
			[" cozily", " warmly", " happily", " adorably", ""],
			["snuddles", "snuddles with", "snuddles into"],
			["!", "! Awwww", "! (¬‿¬)"]
		], ["snudd"]
	),

	new Interaction("Lick", "Lick someone!",
		[
			[" slowly", ""],
			["licks"],
			["!", " on the arm!", " on the face!", " on the... well let's not go there..."]
		], ["licc", "tonguepunch"]
	),

	new Interaction("Nuzzle", "Nuzzle with someone!",
		[
			[" cozily", " warmly"],
			["nuzzles", "nuzzles with", "nuzzles into"],
			["!"]
		], ["nuzz"]
	),

	// %user%[, cozily, warmly] %action%[ nuzzles[ with, into]] %users%!

	new Interaction("Snuggle", "Snuggle with someone!",
		[
			[" cozily", " warmly"],
			["snuggles", "snuggles with", "snuggles into"],
			["!"]
		], ["snugg", "snug"]
	),

	new Interaction("High Five", "Give someone a high five!",
		[
			[""],
			["high fives"],
			["!"]
		], ["high", "five"]
	),

	new Interaction("Tase", "Give someone a shock!!",
		[
			[""],
			["tases","uses a taser on"],
			["!",", take that!",", ouch!"]
		], ["taze"]
	),

	new Interaction("Poke", "Poke poke poke someone!",
		[
			["", " rapidly"],
			["pokes","poke poke pokes"],
			["!","!","!","!","!", ", poke!",", pppppppppppoke!"]
		]
	),

	new Interaction("Spank", "Give someone the spanking they deserve!",
		[
			[""],
			["spanks", "raises their arm and spanks"],
			["!"," on the booty!"]
		]
	),

	new Interaction("Slap", "Slap someone!",
		[
			[" quickly", ""],
			["slaps"],
			["!"," on the face!"]
		]
	),

	new Interaction("Kiss", "Give someone a nice kiss!",
		[
			["", "", " puckers up and", " smiles and"],
			["kisses", "kisses", "gives a big kiss to"],
			["!", "!", " on the lips!", " on the cheek!"]
		], ["smooch"]
	),

	new Interaction("Pet", "Give someone some nice pets!",
		[
			[" softly"],
			["pets","kneads their paws into"],
			["!"]
		]
	),

	new Interaction("Pat", "Give someone some nice pats!",
		[
			[" softly"],
			["pats"],
			["!", " on the head!"]
		]
	),

	new Interaction("Boop", "Give someone a boop on the snoot!",
		[
			["", " playfully", " quickly"],
			["boops"],
			["!", " on the snoot!", " on the nose!"]
		]
	),

	new Interaction("Bite", "Give someone a bite! Rawr!",
		[
			["", " playfully", " quickly", " angrily"],
			["bites"],
			["!", "!", " on the face!", " on the arm!", " on the tail!"]
		], ["chomp"]
	),

	new Command("Bark", function (message, args)
		{
			let picks1 = ["", " Woof Woof!", " Woof!", " Ruff!", " Ruff Ruff!", " Arrwf!", " Awrf!", " Awrf awrf!"];

			let text = `${Tools.serverName(message.author, message.guild)} barks!${Tools.randArray(picks1)}`;
			return text;

		}, "Bark to be heard!", "actions", []
	),

	new Command("Tug", function (message, args)
		{
			let picks1 = [
				"off a mattress tag! That's illegal!",
				"on a german frag grenade activator! Better run!",
				"on their shoelaces... now they have to tie them again.",
				"on their own tail, that's cute, I guess.",
				"on the leaf of a plant, it came off, unsurprisingly.",
				"on a loose thread of their shirt, now it's a bit longer."
				];

			let text = `${Tools.serverName(message.author, message.guild)} tugs ${Tools.randArray(picks1)}`;
			return text;

		}, "Tug on something.", "interactions", []
	),

	new Interaction("Vore", "Fukkin eat someone.",
		[
			["", " rapidly", " vorefully"],
			["eats"],
			["!", " in one gulp!"]
		], ["nom"]
	),

	new Command("Poop", function (message, args)
		{
			return "Why.";

		}, "Poop?", "interactions", ["@user1 @user2 @user.."]
	),

	new Command("huh", function (message, args)
		{
			return "huh";

		}, "huh", null, ["huh"]
	),

	new Command("Wag", function (message, args)
		{
			let picks1 = ["", " rapidly", " happily", " adorably"]
			let picks2 = ["", " *wag wag wag*", " awwwwww.", " *wag wags*", " *waggies*"];

			let text = `${Tools.serverName(message.author, message.guild)}${Tools.randArray(picks1)} wags their tail!${Tools.randArray(picks2)}`;
			return text;

		}, "Wag your tail!", "actions", []
	),

	new Command("Purr", function (message, args)
		{
			let picks1 = ["", " softly", " happily", " adorably"]
			let picks2 = ["", " *purr*", " awwwwww.", " *purrrrr*"];

			let text = `${Tools.serverName(message.author, message.guild)}${Tools.randArray(picks1)} purrs!${Tools.randArray(picks2)}`;
			return text;

		}, "Purr like a kitty!", "actions", []
	),

	new Command("Ruffle", function (message, args)
		{
			let arr = Tools.arrayIntoList(Tools.getMentionList(message, true) ) || "their own";

			let picks1 = ["", " gently", " softly"];
			let picks2 = ["ruffles"];
			let picks3 = [" feathers!", " feathers, squawk!"];

			let text = `${Tools.serverName(message.author, message.guild)}${Tools.randArray(picks1)} ${Tools.randArray(picks2)} ${arr}${args[0] ? "'s" : ""}${Tools.randArray(picks3)}`;
			return text;

		}, "Ruffle someone's feathers!", "interactions", ["@user1 @user2 @user.."]
	),

	new Command("Feed", function (message, args)
		{
			let arr = Tools.arrayIntoList(Tools.getMentionList(message, true) ) || "themselves";

			//console.log(`${message.author.username} ${Prefix}${this.call}:\nFetching foodlist.\n`);
			let foodlist = Tools.settings.read(message.guild, "foods");

			if (foodlist == null) {
				return "The food list is empty.";
			}

			let matches = [];
			if (args[0]) {
				for (let i = 0, l = foodlist.length; i < l; i++) {
					if (foodlist[i].includes(args[0]) ) {
						matches.push(foodlist[i]);
					}
				}
			}

			let text = `${Tools.serverName(message.author, message.guild)} feeds ${arr} ${matches.length > 0 ? Tools.randArray(matches) : Tools.randArray(foodlist)}`;
			return text;

		}, "Give someone a nice snack!", "interactions", ["@user1 @user2 @user.."]
	),

	new Command("Foods", function (message, args)
		{
			if (args[0] == "add") {
				let text = args.full.substring(args[0].length + 1);
				Tools.settings.write(message.guild, "foods", [text], true);
				return `Added \`${text}\` to the food list.`;
			}

			if (args[0] == "search") {
				let foodlist = Tools.settings.read(message.guild, "foods");
				let matches = [];

				for (let i = 0, l = foodlist.length; i < l; i++) {
					if (foodlist[i].includes(args[1]) ) {
						matches.push({text: foodlist[i], index: i});
					}
				}

				if (matches.length == 0) {
					return `No matches for \`${args[1]}\``;
				}

				let text = "Search results:\n";
				for (let i = 0, l = matches.length; i < l; i++) {
					text += `${matches[i].index}: \`${matches[i].text}\`\n`;
				}

				return text;
			}

			if (args[0] == "remove") {
				if (parseInt(args[1]) == NaN) {
					return "Not a valid selection.";
				} else {
					let foodlist = Tools.settings.read(message.guild, "foods");
					let removed = foodlist.splice(parseInt(args[1]), 1);
					Tools.settings.write(message.guild, "foods", foodlist);
					return `Removed \`${removed}\` from the food list.`;
				}
			}

			if (args[0] == "rmlast") {
				let foodlist = Tools.settings.read(message.guild, "foods");
				let removed = foodlist.pop();
				Tools.settings.write(message.guild, "foods", foodlist);
				return `Removed \`${removed}\` from the food list.`;
			}

		}, "Add a food to the food list.", "settings", ["add [text] | rmlast | search [text] | remove [number]"], false, ["MANAGE_CHANNELS"]
	),

	new Command("Server Information", function (message, args) {
			let g = message.guild;
			let url = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;

			let embed = new Discord.MessageEmbed()
			.setTitle(`Information for ${g.name}`)
			.setThumbnail(url)
			.addField("Server Owner:", Tools.serverName(g.owner.user, g), true)
			.addField("Created On:", `${g.createdAt.toLocaleString('default',{month:'long'})} ${g.createdAt.getFullYear()}`, true)
			.addField("Member Count:", `${g.memberCount} users`, true)
			.setFooter(`${g.region} • ${g.id} • ${g.owner.user.username}#${g.owner.user.discriminator}`);

			return new TextMessage(message, embed);
		}, "Get information about the server.", "tools", [], false, [], ["serverinfo"]
	),

	new Command("Echo", function (message, args)
		{
			return args.full;
		}, "Make the bot say what you say", "tools", ["text"], true, ["MANAGE_MESSAGES"]
	),

	new Command("UwU Speak", function (message, args) {
			return `${message.author} (${Prefix}${this.call}):\n${Tools.makeUwU(args.full)}`;
		}, "Convert to UwU speak!", "fun", ["text"], true, [], ["uwu"]
	),

	new Command("Decide", function (message, args) {

			let arr = args.slice();
			arr.shift();
			let pick = Math.floor(Math.random() * arr.length);
			let text = `Deciding from:\n${Tools.arrayIntoList(arr)}\nWinner is: **${arr[pick]}**`;
			return text;
		}, "Randomly decide from values", "tools", ["option1","option2","option.."]
	),

	new ImageShare("Dance", ".gif"),

	new ImageShare("Grant"),

	new ImageShare("Fox"),

	new Command("Leave", function (message, args) {
			Tools.disconnect(message.client);
			return "Disconnecting...";
		}, "Disconnect the bot.", null, [], false, ["ADMINISTRATOR"]
	),

	new Command("List Emotes", function (message, args) {
			
			let emotes = message.guild.emojis.cache.array();
			let list = [];

			for (let i = 0, l = emotes.length; i < l; i++) {
				list.push(emotes[i].toString() );
			}

			return list;

		}, "List all the server's emotes.", null, [], true, ["ADMINISTRATOR"]
	),

	new Command("Vote", function (message, args) {
			
			if (this.usage[0].test(args[0]) ) {

				let value = new Object()
				value[message.channel.id.toString()] = {"vote": args[0]};

				Tools.settings.write(message.guild, "channels", value, true);
				return `Channel vote setting set to **${args[0]}**.`;
			} else {
				return `Valid vote settings are ${Tools.arrayIntoList(this.usage[0].options, false)}`;
			}

		}, "Setup this channel with react voting.", "settings",
		[
			new UsageString("setting", ["all", "images", "off"])
		], false, ["ADMINISTRATOR"]
	),

	new Command("Stat List", function (message, args) {

			let value = Tools.settings.read(message.guild, "users");
			value = value[message.author.id].stats;

			return JSON.stringify(value);

		}, "Get your player stats for DnD", "DnD", []
	),

	new Command("Calculator", function (message, args) {
			let exp = args.full;

			var text = "";
			try {
				text = MathJS.evaluate(exp).toString();
			} catch (error) {
				text = error.message;
			}

			return text;
		}, "Enslave the bot to do math!", "tools", ["expression"], false, [], ["calc"]
	),

	new Command("Test Error", "This is not supposed to be a string", "", null),

	new Command("Hex Color", function (message, args) {

			if (args[0] == "FUCKME") {
				return "OwO";
			}

			if (args[0] == null) {
				return `Specify a hex code.`;
			}

			if (args[0].replace(/[^a-f0-9]/gi,'').length != 6) {
				return `**${args[0]}** is not a valid hex code.`;
			}	

			let colorName = Tools.colors.closest(args[0]);
			let colorCode = Tools.colors.format(args[0]).substring(1);
			let url = `https://via.placeholder.com/50/${colorCode}/${colorCode}.png`;

			let embed = new Discord.MessageEmbed()
			.setThumbnail(url)
			.addField("#" + colorCode, colorName);

			return new TextMessage(message, embed);

		}, "Get a preview of a hex color!", "tools", ["hex code"], false, [], ["hex"]
	),

	new Command("To Binary", function (message, args) {

			if (Number.isNaN(parseInt(args[0]) ) ) {
				let content = args.full;

				let text = "";
				for (let i = 0, l = content.length; i < l; i++) {
					text += `\`${Tools.formatBin(content.charCodeAt(i) )}\` `;
				}
				return text;
			}

			return parseInt(args[0]).toString(2);
		}, "Turn something into binary!", "tools", ["number"], false, [], ["tobin"]
	),

	new Command("To Hexadecimal", function (message, args) {

			if (Number.isNaN(parseInt(args[0]) ) ) {
				let content = args.full;

				let text = "";
				for (let i = 0, l = content.length; i < l; i++) {
					text += `\`${Tools.formatHex(content.charCodeAt(i) )}\` `;
				}
				return text.toUpperCase();
			}

			return parseInt(args[0]).toString(16).toUpperCase();
		}, "Turn something into hexadecimal!", "tools", ["number"], false, [], ["tohex"]
	),

	new Command("Roll", function (message, args) {

			let rolls = this.usage[0].test(args[0]) || 2;

			let text = "Rolls: ", total = 0, succ = 0;
			for (let i = 0; i < rolls; i++) {
				let pick = Tools.randNumber(1, 6);
				text += `${pick}${i != rolls - 1 ? ", " : ""}`;
				total += pick;
				succ += pick >= 4 ? 1 : 0;
  			}
			text =  `${text}\nTotal: ${total}\nSuccesses: ${succ}`;

			return [new TextMessage(message, text), new ReactEmote(message, "🎲")];
		}, "Roll a number of dice!", "tools",
		[
			new UsageNumber("rolls", 1, 15)
		]
	),

	new Command("Request", function (message, args) {
			
			let guild = "704494659400892458";
			let channel = "718827126878371881";
			let content = `**${message.author.username}#${message.author.discriminator}**:\n${args.full}\n`;

			return [new Transpose(content, guild, channel), new ReactEmote(message, "✅")];

		}, "Make a suggestion for bot changes", "tools", ["text"]
	),

	new Command("Ping", function (message, args) {
			
			return new PingMessage(message, ["Pong.", "**Pong! **"]);

		}, "Ping the bot!", "tools"
	),

	new Command("Kick", function (message, args) {

			let users = message.mentions.users.array();

			if (users < 1) {
				return "Specify users to kick.";
			}

			for (let i = 0, l = users.length; i < l; i++) {

				let replace = users[i].toString().replace("<@", "<@!");
				replace = new RegExp(replace, "g");
				message.content = message.content.replace(replace, "").trim();
			}

			let members = message.guild.members.cache;
			for (let i = 0, l = users.length; i < l; i++) {

				let member = members.get(users[i].id);
				member.kick(message.content);
			}

			return `Kicked ${Tools.arrayIntoList(Tools.getMentionList(message, true) )}`;

		}, "Kick a user.", "moderation", ["reason &| @user1 @user2 @user.."], false, ["KICK_MEMBERS"]
	),

	new Command("Ban", function (message, args) {

			let users = message.mentions.users.array();

			if (users < 1) {
				return "Specify users to ban.";
			}

			for (let i = 0, l = users.length; i < l; i++) {

				let replace = users[i].toString().replace("<@", "<@!");
				replace = new RegExp(replace, "g");
				message.content = message.content.replace(replace, "").trim();
			}

			let members = message.guild.members.cache;
			for (let i = 0, l = users.length; i < l; i++) {

				let member = members.get(users[i].id);
				member.ban({reason: message.content});
			}

			return `Banned ${Tools.arrayIntoList(Tools.getMentionList(message, true) )}`;

		}, "Ban a user.", "moderation", ["reason &| @user1 @user2 @user.."], false, ["BAN_MEMBERS"]
	),

	new Command("Set Log Channel", function (message, args) {

			let value = message.channel.id;
			Tools.settings.write(message.guild, "logchannel", value);

			return "Channel set as log channel!";

		}, "Set this channel as the logging channel", "moderation", [], false, ["ADMINISTRATOR"]
	)
];

for (let i = 0, l = commandList.length; i < l; i++) {

	let cmdi = commandList[i];
	if (!commandCategoryList.includes(cmdi.category) ) {
		commandCategoryList.push(cmdi.category);
	}
}

function helpCommand (message, args) {

	return new TextMessage(message, "Help command is currently WIP.");

	let embed = new Discord.MessageEmbed()
	//.setThumbnail(Client.user.avatarURL() )
	.setColor("64BF51")
	.setFooter("This bot is a WIP by TheAlbinoDillo");

	if (args[0] != undefined) {
		if (commandCategoryList.includes(args[0]) ) {
			for (let i = 0, l = commandList.length; i < l; i++) {
				let cli = commandList[i];
				if (cli.category == args[0]) {
					embed.setTitle(`Command category: ${args[0]}`)
					.addField(`**${cli.name}**${cli.onlyOwner ? "®" : ""}\n${cli.description}`,`${Prefix}${cli.calls[cli.calls.length - 1]} ${usageList(cli)}`);
				}
			}
			return new TextMessage(message, embed);
		}
		let selected = -1;
		for (let i = 0, l = commandList.length; i < l; i++) {
			if (commandList[i].call == args[0]) {
				selected = i;
			}
		}
		if (selected > -1) {
			let cls = commandList[selected];
			embed.setTitle(`Command: ${cls.name} ${cls.onlyOwner ? "[Restricted]" : ""}`)
			.addField(cls.description, `${Prefix}${cls.call} ${usageList(cls)}`);
			
			return new TextMessage(message, embed);
		}
	}
	embed.setTitle(`FurGun commands list`);

	for (let i = 0, l = commandCategoryList.length; i < l; i++) {

		let ccli = commandCategoryList[i];
		if (ccli == "unlisted") {
			continue;
		}
		embed.addField(`${ccli}`,`${Prefix}help ${ccli}`);
	}

	return new TextMessage(message, embed);
}

function usageList (command) {

	if (command.usage == undefined) {
		return "";
	}

	let list = new Array();
	for (let i = 0, l = command.usage.length; i < l; i++) {
		list[i] = ` <${command.usage[i]}>`;
	}
	return list;
}

module.exports =
{
	commandList: commandList,
	prefix: Prefix
};