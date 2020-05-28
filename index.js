"use strict";

//"Import" Dependencies
const Discord = require("discord.js");
const ReadLine = require("readline");
const FileSystem = require("fs");
const MathJS = require("mathjs");
const Request = require("request");
const Tools = require("./botTools.js");

//Setup Discord Client
const Client = new Discord.Client();
const Token = 'NjYyODI1ODA2OTY3NDcyMTI4.Xqzm2Q.I2y50w7Nu5QmgMqamCI9a3VuxMc';
const Prefix = 'fg.';

//Client variables
var ClientLoggedIn = false;
var foodCommandList = [];
var commandCategoryList = new Array();
var bandwagonCommandVar = { leader: undefined, limit: -1, members: [] };
var consoleLogging = { enabled: false, user: undefined };

//Setup ReadLine Interface
const Interface = ReadLine.createInterface({
	input: process.stdin,
	output: process.stdout
});

//Setup Discord Client Events
Client.on("ready", () => { botLog("Client is ready\n"); ClientOnReady(); });
Client.on("message", message => { ClientOnMessage(message); });
Client.on("messageUpdate", (oldMessage, newMessage) => { ClientOnMessageUpdate(oldMessage, newMessage); });
Client.on("guildMemberAdd", member => {  });

//Setup Interface Events
Interface.on('line', (input) => { InterfaceOnLine(input); });

//Discord Called Events
function ClientOnReady () {	//Called when after Discord Client is logged in

	initCommands();

	for (let i = 0, l = commandList.length; i < l; i++) {

		let cmdi = commandList[i];
		if (!commandCategoryList.includes(cmdi.category) ) {
			commandCategoryList.push(cmdi.category);
		}
	}

	foodCommandList = readJSON("common/foods");
}

function ClientOnMessage (message) {	//Called when the Client receives a message

	if (message.content.toLowerCase().indexOf(Prefix) == 0 && message.channel.guild) {
		
		if (message.author.bot) {
			botLog(`Bot (${message.author.username}) tried using a command:\n${message.content}\n`);
		} else {
			runCommand(message);
		}
	}

	if (!message.author.bot) {
		let maa = message.attachments.array()[0];
		if (maa != undefined) {
			if (maa.width != undefined) {
				botReact(message, ":symbol_reddit_vote_up:680935204050698329");
				botReact(message, ":symbol_reddit_vote_down:680935348272103445");
			}
		}
	}
}

function ClientOnMessageUpdate (oldMessage, newMessage) {	//Called when the Client receives a message edit
}

//ReadLine Interface Called Events
function InterfaceOnLine (input) {	//Called when the console receives command line input

	if (input == "leave") {
		Disconnect();
	}
}

//Client logon functions
Connect(Token);
function Connect (token, seconds = 3) {

	if (ClientLoggedIn) return;
	console.log("\nAttempting to connect to Discord...\n");

	Client.login(Token).then(token => {
		botLog(`Logged in with token starting with: "${token.substring(0, 5)}"\n`);
		ClientLoggedIn = true;

	}).catch(error => {
		console.error(`Failed to connect to Discord:\n${error.message}\nTrying again in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);
		Client.setTimeout( () => {
			Connect(token, seconds);
		}, seconds * 1000);
	});
}

function Disconnect (message, seconds = 3) {

	botLog(`Disconnecting Client and ending nodeJS script in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);

	if (message != undefined) {
		botDelete(message);
	}

	Client.setTimeout( () => {
		Client.destroy();
		process.exit(621);
	}, seconds * 1000);
}

function Activity (type = "WATCHING", activity = `${Prefix}help`) {

	Client.user.setActivity(activity, { type: type }).then(presence => {
		botLog(`Activity set to "${presence.activities[0].name}".\n`);
	}).catch(error => {
		botError(`Could not set activity:\n${error.message}\n`);
	});
}

//Client message functions
function botSend (message, content) {	//Send a message to the specified channel

	if (typeof content == typeof "string") {
		if (content.trim() == "") {
			botError("Message content is empty, this would fail. Did not send message.\n");
			return null;
		} else if (content.length > 2000) {
			botError("Message content exceeds 2000 characters, this would fail. Did not send message.\n");
			return null;
		}
	}

	return message.channel.send(content).then(thisMsg => {
		botLog(`Sent to ${thisMsg.channel.name}(${thisMsg.channel.guild.name}):\n${thisMsg.content}`);
		
	}).catch(error => {
		botError(`Error sending message:\n${error.message}\n`);
		botReact(message, "‼️");
	});
}

function botEdit (message, content, append = false) {	//Edit a specified message

	if (content.trim() == "") {
		botError("Edit content is empty, this would fail. Did not edit message.\n");
		return null;
	}

	return message.edit(`${append ? message.content : content}${append ? content : ''}`).then(message => {
		botLog(`Edited message in ${message.channel.name}(${message.channel.guild.name}) to:\n${message.content}`);
	}).catch(error => {
		botError(`Error editing message:\n${error.message}\n`);
	});
}

function botDelete (message) {	//Delete a specified message

	message.delete().then(message => {
		botLog(`Deleted message from ${message.author} in ${message.channel.name}(${message.channel.guild.name}):\n${message.content}`);
	}).catch(error => {
		botError(`Error deleting message:\n${error.message}\n`);
	});
}

function botReact (message, emote) {
	message.react(emote).then( () => {
		botLog(`Reacted with ${emote} to:\n${message.content}\n`);
	}).catch(error => {
		botError(`Failed to react to message:\n${error.message}\n`);
	});
}

function botSendDM (user, content) {	//Send a DM message to a user

	let name = user.username;

	if (user.dmChannel == undefined) {
		user.createDM().then(channel => {
			console.log(`Created a DM channel for ${name}`);
			botSendDM(user, content);
		}).catch(error => {
			console.error(`Error creating a DM channel for ${name}:\n${error.message}\n`);
		});

		return;
	}

	if (content.trim() == "") {
		console.error("DM content is empty, this would fail. Did not DM user.\n");
		return null;
	}

	user.dmChannel.send(content).then(message => {
		console.log(`Sent a DM to ${name}:\n${content}\n`);
	}).catch(error => {
		console.error(`Error sending a DM to ${name}${error.message}`);
	});
}

function botLog (content, realLog = true) {

	if (realLog) {
		console.log(content);
	}

	if (!consoleLogging.enabled) return;

	botSendDM(consoleLogging.user, `\`\`\`${content}\`\`\``);
}

function botError (content) {
	botLog(content, false);
	console.error(content);
}

//Client misc. functions
function serverName (user, guild, bold = true, removeSpecial = true) {	//Get the server nickname of a user and clean it up

	if (guild == undefined) {
		botError("A guild was not provided. Did not get server name of user.\n")
	}

	let name = guild.member(user).nickname;
	let regex = /([❄]|[\u2B50]|[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
	//let regex = /([^\u0000-\u007f])/gi;

	if (removeSpecial && name != null) {	//Remove emojis and symbol characters, uppercase the first letter
		name = name.replace(/[-_]/g,' ').replace(regex, '').trim();
		name = `${name[0].toUpperCase()}${name.substring(1)}`;

		if (name.length <= 1) {
			name = null;
		}
	}

	return `${bold ? "**" : ""}${name ? name : user.username}${bold ? "**" : ""}`;
}

function getMentionList (message, returnNames, removeSelf = true, removeBots = false) {	//Get all the user mentions in a message

	let mentions = message.mentions.users.array();

	for (let i = 0, l = mentions.length; i < l; i++) {	//Remove the user writing the message or any bots
		if ( (mentions[i] == message.author && removeSelf) || (mentions[i].bot && removeBots) ) {
			mentions.splice(i, 1);
		}
	}

	if (returnNames) {	//Turn mentions into server names
		for (let i = 0, l = mentions.length; i < l; i++) {
			mentions[i] = serverName(mentions[i], message.guild);
		}
	}

	return mentions;
}

function writeJSON (filename, object) {	//Write an object to a JSON file

	let string = JSON.stringify(object);

 	try {
		FileSystem.writeFileSync(`./files/${filename}.json`, string);
		botLog(`Wrote to "${filename}.json":\n${string}\n`);
	} catch (error) {
		botError(`Failed to write to "${filename}.json":\n${error.message}\n`);
	}
}

function readJSON (filename) {	//Read an object from a JSON file

	let content;
	try {
		content = FileSystem.readFileSync(`./files/${filename}.json`);
		botLog(`Read from "${filename}.json":\n${(content.length > 100) ? `${content.toString().substring(0, 150)}...` : content}\n`);
	} catch (error) {
		botError(`Failed to read from "${filename}.json":\n${error.message}\n`);
		return null;
	}

	return JSON.parse(content);
}

function arrayIntoList (array) {	//Turn an array into a human-readable list

	let l = array.length;

	if (l == 0) {
		return undefined;
	}

	let text = "";
	if (l <= 2) {
		text += (l == 2) ? `${array[0]} and ${array[1]}` : `${array[0]}`;
	} else {
		for (let i = 0; i < l; i++) {
			text += `${(i == l - 1) ? " and " : ""}${array[i]}${(i < l - 2) ? ", " : ""}`;
		}
	}

	return text;
}

function randArray (array) {	//Randomly pick from an array
	let pick = Math.floor(Math.random() * array.length);
	return array[pick];
}

function randNumber (max) {
	return Math.floor(Math.random() * max);
}

function helpCommand (message, args) {

	let embed = new Discord.MessageEmbed()
	.setThumbnail(Client.user.avatarURL() )
	.setColor("64BF51")
	.setFooter("This bot is a WIP by TheAlbinoDillo");

	if (args[1] != undefined) {
		if (commandCategoryList.includes(args[1]) ) {
			for (let i = 0, l = commandList.length; i < l; i++) {
				let cli = commandList[i];
				if (cli.category == args[1]) {
					embed.setTitle(`Command category: ${args[1]}`)
					.addField(`**${cli.name}**${cli.onlyOwner ? "®" : ""}\n${cli.description}`,`${Prefix}${cli.call} ${usageList(cli)}`);
				}
			}
			botSend(message, embed);
			return;
		}
		let selected = -1;
		for (let i = 0, l = commandList.length; i < l; i++) {
			if (commandList[i].call == args[1]) {
				selected = i;
			}
		}
		if (selected > -1) {
			let cls = commandList[selected];
			embed.setTitle(`Command: ${cls.name} ${cls.onlyOwner ? "[Restricted]" : ""}`)
			.addField(cls.description, `${Prefix}${cls.call} ${usageList(cls)}`);
			botSend(message, embed);
	
			return;
		}
	}
	embed.setTitle(`${Client.user.username} commands list`);

	for (let i = 0, l = commandCategoryList.length; i < l; i++) {

		let ccli = commandCategoryList[i];
		if (ccli == "unlisted") {
			continue;
		}
		embed.addField(`${ccli}`,`${Prefix}help ${ccli}`);
	}

	botSend(message, embed);
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

function runCommand (message) {

	let args = message.content.substring(Prefix.length).split(" ");

	let selectedCommand = null;
	for (let i = 0, l = commandList.length; i < l; i++) {
		if (commandList[i].call == args[0]) {
			selectedCommand = commandList[i];
			break;
		}
	}

	if (!selectedCommand) {
		botSend(message, `**${Prefix}${args[0]}** is not a command.`);
		return;
	}

	let hasPerms = true;
	for (let i = 0, l = selectedCommand.permissions.length; i < l; i++) {
		if (message.member.permissions.has(selectedCommand.permissions[i]) == false) {
			hasPerms = false;
			break;
		}
	}

	if (!hasPerms) {
		//botSend(message, `${serverName(message.author, message.guild)} does not have permission to use **${Prefix}${args[0]}**`);
		botReact(message, "⛔");
		return;
	}

	try {
		selectedCommand.runFunction(message, args);
	} catch (error) {
		//botSend(message, `Command Failed:\n${error.message}`);
		console.error(error);
		botReact(message, "⁉️");
	}
}

class Command {
	constructor(name, runFunction = function () {}, description = "", category, usage = [], deleteMessage = false, permissions = [], call = false) {
		this.name = name;
		this.runFunction = runFunction;
		this.description = description;
		this.category = category ? category : "unlisted";
		this.usage = usage;
		this.deleteMessage = deleteMessage;
		this.permissions = permissions;
		this.call = call ? call : name.toLowerCase().replace(/ /g, "");
	}
}

class Interaction extends Command {
	constructor(name, description, outputs, call, defaultWord = "themselves") {
		super
		(
			name,
			function (message, args)
			{
				let arr = arrayIntoList(getMentionList(message, true) ) || defaultWord;
				let picks = this.outputs;

				let text = `${serverName(message.author, message.guild)}${randArray(picks[0])} ${randArray(picks[1])} ${arr}${randArray(picks[2])}`;
				botSend(message, text);
			},
			description = description,
			"interactions",
			["@user1","@user2","@user.."],
			false,
			[],
			call ? call : name.toLowerCase().replace(/ /g, "")
		);
		this.outputs = outputs;
	}
}

function initCommands () {

}

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
			[""],
			["cuddles"],
			["!"]
		]
	),

	new Interaction("Nuzzle", "Nuzzle with someone!",
		[
			[" cozily", " warmly"],
			["nuzzles", "nuzzles with", "nuzzles into"],
			["!"]
		]
	),

	new Interaction("Snuggle", "Snuggle with someone!",
		[
			[" cozily", " warmly"],
			["snuggles", "snuggles with", "snuggles into"],
			["!"]
		]
	),

	new Interaction("High Five", "Give someone a high five!",
		[
			[""],
			["high fives"],
			["!"]
		],
		"high"
	),

	new Interaction("Tase", "Give someone a shock!!",
		[
			[""],
			["tases","uses a taser on"],
			["!",", take that!",", ouch!"]
		]
	),

	new Interaction("Spank", "Give someone the spanking they deserve!",
		[
			[""],
			["spanks", "raises their arm and spanks"],
			["!"," on the booty!"]
		]
	),

	new Interaction("Kiss", "Give someone a nice kiss!",
		[
			["", "", " puckers up and", " smiles and"],
			["kisses", "kisses", "gives a big kiss to"],
			["!", "!", " on the lips!", " on the cheek!"]
		]
	),

	new Interaction("Pet", "Give someone some nice pets!",
		[
			[" softly"],
			["pets"],
			["!", " on the head!"]
		]
	),

	new Command("Server Information", function (message, args) {
			let g = message.guild;
			let url = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;

			let embed = new Discord.MessageEmbed()
			.setTitle(`Information for ${g.name}`)
			.setThumbnail(url)
			.addField("Server Owner:", serverName(g.owner.user, g), true)
			.addField("Created On:", `${g.createdAt.toLocaleString('default',{month:'long'})} ${g.createdAt.getFullYear()}`, true)
			.addField("Member Count:", `${g.memberCount} users`, true)
			.setFooter(`${g.region} • ${g.id} • ${g.owner.user.username}#${g.owner.user.discriminator}`);

			botSend(message, embed);
		}, "Get information about the server.", "tools", [], false, [], "serverinfo"
	),

	new Command("Marco", function (message, args) {
			let pingTime = message.createdTimestamp;
			message.channel.send("Polo").then(msg => {
				botEdit(msg, `**Polo** \`${(msg.createdTimestamp - pingTime)} ms\``);
			}).catch(error => {
				botError(`Error sending marcopolo message:\n${error.message}\n`);
			});
		}, "Ping a simple responce from the bot", "tools"
	),

	new Command("Echo", function (message, args)
		{
			let content = message.content.substring(Prefix.length).substring(this.call.length);
			botSend(message, content);
		}, "Make the bot say what you say", "tools", ["text"], true, ["MANAGE_MESSAGES"]
	),

	new Command("Decide", function (message, args) {

			let arr = args.slice();
			arr.shift();
			let pick = Math.floor(Math.random() * arr.length);
			let text = `Deciding from:\n${arrayIntoList(arr)}\nWinner is: **${arr[pick]}**`;
			botSend(message, text);
		}, "Randomly decide from values", "tools", ["option1","option2","option.."]
	),

	new Command("Dance", function (message, args) {

			let pick = new Array();
			let pickLength = FileSystem.readdirSync("./files/common/dance/").length;
			let choice = parseInt(args[1]);

			let url = `./files/common/dance/dance${choice > -1 ? choice : randNumber(pickLength)}.gif`;
			botSend(message, {files: [url]});
		}, "Let's dance!", "fun"
	),

	/*new Command("Fezzy", function (message, args) {

			let pick = new Array();
			let pickLength = FileSystem.readdirSync("./files/common/dance/").length;
			let choice = parseInt(args[1]);

			let url = `./files/common/dance/dance${choice > -1 ? choice : randNumber(pickLength)}.gif`;
			botSend(message, {files: [url]});
		}, "Let's dance!", "fun"
	),*/

	new Command("Leave", function (message, args) {
			Disconnect(message);
		}, "Disconnect the bot.", null, [], false, ["ADMINISTRATOR"]
	),

	new Command("Calculator", function (message, args) {
			let exp = message.content.substring(Prefix.length + args[0].length);

			var text = "";
			try {
				text = MathJS.evaluate(exp).toString();
			} catch (error) {
				text = error.message;
			}

			botSend(message, text);
		}, "Enslave the bot to do math!", "tools", ["expression"], false, [], "calc"
	)
];