"use strict";

const Discord = require("discord.js");
const fs = require("fs");
const MathJS = require("mathjs");
const Tools = require("./botTools.js");

const Prefix = 'fg.';
const imageBase = JSON.parse(fs.readFileSync("./files/common/images.json"));

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

		calls.unshift(name.toLowerCase().replace(/ /g, "") );
		this.calls = calls;
	}
}

class Interaction extends Command {
	constructor(name, description, others, self, calls = [], defaultWord = "themselves") {
		super
		(
			name,
			function (message, args)
			{
				let replacements =
				{
					user: `**${message.member.displayName}**`,
					users: Tools.arrayIntoList(Tools.getMentionList(message, true) )
				};

				let parseScript = (script) =>
				{
					return Tools.JSONscript(replacements, script);
				};

				if (!replacements.users && !this.self) {
					replacements.users = defaultWord;
				}

				if (replacements.users) {
					return parseScript(this.others);
				} else {
					return parseScript(this.self);
				}
			},
			description = description,
			"interactions",
			["@user1 @user2 @user.."],
			false,
			[],
			calls
		);
		this.others = others;
		this.self = self;
	}
}

class ImageShare extends Command {
	constructor(name, albumName) {

		albumName = albumName || name.toLowerCase();

		super
		(
			name,
			function (message, args) {

				let returnUrl = (index, reactions, showTags = true) =>
				{
					let img = imageBase[albumName][index];
					let content = {files: [img.link]};

					if (showTags) {
						let txt = `\`${img.tags.join(", ")}\``;
						content.content = txt;
					}

					let msg = new TextMessage(message, content);
					let returnList = [msg];

					if (reactions) {
						reactions.forEach( (e) =>
						{
							returnList.push(new ReactEmote(message, e) );
						});
					}

					return returnList;
				};

				let randAll = Tools.randNumber(imageBase[albumName].length - 1);

				let pick = this.usage[0].test(args[0]);
				if (pick) {

					let list = [];
					imageBase[albumName].forEach( function(e, i) {
						if (e.tags.includes(args[0]) ) {
							list.push(i);
						}
					});

					if (list.length > 0) {
						return returnUrl(Tools.randArray(list), ["🔍", "✅"], false);
					} else {
						return returnUrl(randAll, ["🔍", "❌", "🎲"]);
					}
				}

				return returnUrl(randAll, ["🎲"]);
			},
			`Get ${albumName} pictures!`,
			"fun",
			[new UsageString("tag")],
			false,
			[]
		);
	}
}

var commandCategoryList = new Array();
const commandList =
[
	new Command("Help", helpCommand, "Get help"),

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

for (let album in imageBase) {

	let img = new ImageShare(album);
	commandList.push(img);
}

let dir = fs.readdirSync(`./files/commands/interactions`);
dir.forEach( function(e, i) {

	let obj = JSON.parse(fs.readFileSync(`./files/commands/interactions/${e}`) );

	let int = new Interaction(obj.name, obj.description, obj.script, obj.self, obj.calls);
	commandList.push(int);
});

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
