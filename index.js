//"Import" Dependencies
const Discord = require("discord.js");
const ReadLine = require("readline");
const MathJS = require("mathjs");
const Request = require("request");
const Tools = require("./botTools.js");
const Commands = require("./commands.js");
const Messaging = require("./botMessaging.js");

//Setup Discord Client
var Client = new Discord.Client();
const Token = 'NjYyODI1ODA2OTY3NDcyMTI4.Xqzm2Q.I2y50w7Nu5QmgMqamCI9a3VuxMc';
const Prefix = 'fg.';

//Client variables
var ClientLoggedIn = false;
var commandCategoryList = new Array();

//Setup ReadLine Interface
const Interface = ReadLine.createInterface({
	input: process.stdin,
	output: process.stdout
});

//Setup Discord Client Events
Client.on("ready", () => { Messaging.botLog("Client is ready\n"); ClientOnReady(); });
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
}

function ClientOnMessage (message) {	//Called when the Client receives a message

	if (message.content.toLowerCase().indexOf(Prefix) == 0 && message.channel.guild) {
		
		if (message.author.bot) {
			Messaging.botLog(`Bot (${message.author.username}) tried using a command:\n${message.content}\n`);
		} else {
			runCommand(message);
		}
	}

	if (!message.author.bot) {
		let maa = message.attachments.array()[0];
		if (maa != undefined) {
			if (maa.width != undefined) {
				Messaging.botReact(message, ":symbol_reddit_vote_up:680935204050698329");
				Messaging.botReact(message, ":symbol_reddit_vote_down:680935348272103445");
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
		Messaging.botLog(`Logged in with token starting with: "${token.substring(0, 5)}"\n`);
		ClientLoggedIn = true;

	}).catch(error => {
		console.error(`Failed to connect to Discord:\n${error.message}\nTrying again in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);
		Client.setTimeout( () => {
			Connect(token, seconds);
		}, seconds * 1000);
	});
}

function Disconnect (message, seconds = 3) {

	Messaging.botLog(`Disconnecting Client and ending nodeJS script in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);

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
		Messaging.botLog(`Activity set to "${presence.activities[0].name}".\n`);
	}).catch(error => {
		botError(`Could not set activity:\n${error.message}\n`);
	});
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

	Messaging.botLog(`\nCommand detected from ${message.author.username} in ${message.channel.name} at ${new Date(message.createdTimestamp)} :\n${text}`);

	for (var i = 0; i < Commands.commandList.length; i++) {
		if (args[0].toLowerCase() == Commands.commandList[i].call) {

			if ( (Commands.commandList[i].onlyOwner && message.author == message.guild.owner.user) || !Commands.commandList[i].onlyOwner) {
				try {
					Commands.commandList[i].run(message, args);
				} catch (error) {
					Messaging.botLog(error.message);
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

module.exports =
{
	Client: Client
};