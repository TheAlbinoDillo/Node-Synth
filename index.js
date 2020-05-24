//"Import" Dependencies
const Discord = require("discord.js");
const ReadLine = require("readline");
const MathJS = require("mathjs");
const Request = require("request");
const Tools = require("./botTools.js");
const Commands = require("./commands.js");

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

	for (let i = 0, l = Commands.commandList.length; i < l; i++) {

		let cmdi = Commands.commandList[i];

		if (!cmdi.call) {
			cmdi.call = cmdi.name.toLowerCase().replace(/ /g, "");
		}

		if (cmdi.category == undefined) {
			cmdi.category = "unlisted";
		} else if (cmdi.category == "interactions" && cmdi.usage == undefined) {
			cmdi.usage = ["@User1","@User2","@User.."];
		}

		if (!commandCategoryList.includes(cmdi.category) ) {
			commandCategoryList.push(cmdi.category);
		}
	}

	foodCommandList = readJSON("foods");
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
		botReact(message, ":BOT_ERROR:713595499067736067");
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

function helpCommand (message, args) {

	let embed = new Discord.MessageEmbed()
	.setThumbnail(Client.user.avatarURL() )
	.setColor("64BF51")
	.setFooter("This bot is a WIP by TheAlbinoDillo");

	if (args[1] != undefined) {
		if (commandCategoryList.includes(args[1]) ) {
			for (let i = 0, l = Commands.commandList.length; i < l; i++) {
				let cli = Commands.commandList[i];
				if (cli.category == args[1]) {
					embed.setTitle(`Command category: ${args[1]}`)
					.addField(`**${cli.name}**${cli.onlyOwner ? "®" : ""}\n${cli.desc}`,`${Prefix}${cli.call} ${usageList(cli)}`);
				}
			}
			botSend(message, embed);
			return;
		}
		let selected = -1;
		for (let i = 0, l = Commands.commandList.length; i < l; i++) {
			if (Commands.commandList[i].call == args[1]) {
				selected = i;
			}
		}
		if (selected > -1) {
			let cls = Commands.commandList[selected];
			embed.setTitle(`Command: ${cls.name} ${cls.onlyOwner ? "[Restricted]" : ""}`)
			.addField(cls.desc, `${Prefix}${cls.call} ${usageList(cls)}`);
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

	message.channel.startTyping();

	var text = message.content;
	var args = text.substring(Prefix.length).split(" ");

	botLog(`\nCommand detected from ${message.author.username} in ${message.channel.name} at ${new Date(message.createdTimestamp)} :\n${text}`);

	for (var i = 0; i < Commands.commandList.length; i++) {
		if (args[0].toLowerCase() == Commands.commandList[i].call) {

			if ( (Commands.commandList[i].onlyOwner && message.author == message.guild.owner.user) || !Commands.commandList[i].onlyOwner) {
				try {
					Commands.commandList[i].run(message, args);
				} catch (error) {
					botLog(error.message);
				}
	
				if (Commands.commandList[i].delmsg) {
					message.delete();
				}
			} else {
				botSend(message, "This command can only be used by the owner.");
			}
			message.channel.stopTyping();
			return;
		}
	}
	botSend(message, `**${Prefix + args[0]}** is not a command. Use **${Prefix}help** for avalible commands.`);
	message.channel.stopTyping();
}

