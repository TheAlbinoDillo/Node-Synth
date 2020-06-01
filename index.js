"use strict";

//"Import" Dependencies
const Discord = require("discord.js");
const ReadLine = require("readline");
const MathJS = require("mathjs");
const Tools = require("./files/scripts/botTools.js");
const Commands = require("./files/scripts/commands.js");

//Setup Discord Client
const Client = new Discord.Client();
const Token = 'NjYyODI1ODA2OTY3NDcyMTI4.Xqzm2Q.I2y50w7Nu5QmgMqamCI9a3VuxMc';

//Client variables
var ClientLoggedIn = false;

var consoleStatus =
{
	guild: null,
	channel: null
};

//Setup ReadLine Interface
const Interface = ReadLine.createInterface
({
	input: process.stdin,
	output: process.stdout
});

//Setup Discord Client Events
Client.on("ready", () =>
	{
		console.log("Client is ready\n"); ClientOnReady();
	}
);
Client.on("message", message =>
	{
		ClientOnMessage(message);
	}
);
Client.on("messageUpdate", (oldMessage, newMessage) =>
	{
		ClientOnMessageUpdate(oldMessage, newMessage);
	}
);
Client.on("guildMemberAdd", member => {  });

//Setup Interface Events
Interface.on('line', (input) => { InterfaceOnLine(input); });

//Discord Called Events
function ClientOnReady () {	//Called when after Discord Client is logged in

	if (Tools.isDebug) {
		console.log("\n----------------Running in Debug Mode-----------------\n");
		Activity("PLAYING", "Debugging");
	}
}

function ClientOnMessage (message) {	//Called when the Client receives a message

	if (consoleStatus.channel == message.channel) {
		console.log(`${message.author.username}:\t${message.content}`);
	}

	if (message.content.toLowerCase().indexOf(Commands.prefix) == 0 && message.channel.guild) {
		
		if (message.author.bot) {
			console.log(`Bot (${message.author.username}) tried using a command:\n${message.content}\n`);
		} else {
			runCommand(message);
		}
	}

	if (!message.author.bot) {
		let maa = message.attachments.array()[0];
		if (maa != undefined) {
			if (maa.width != undefined) {

				pinReact(message);

				//botReact(message, ":symbol_reddit_vote_up:680935204050698329");
				//botReact(message, ":symbol_reddit_vote_down:680935348272103445");
			}
		}
	}
}

function ClientOnMessageUpdate (oldMessage, newMessage) {	//Called when the Client receives a message edit
}

//ReadLine Interface Called Events
function InterfaceOnLine (input) {	//Called when the console receives command line input


	let args = input.split(" ");
	switch (args[0]) {
		case "leave":
			Disconnect();
			break;
		case "dir":
			dir(args);
			break;
		case "send":
			if (consoleStatus.guild != null && consoleStatus.channel != null) {
				consoleStatus.channel.send(input.substring(5) );
			}
			break;
		case "eval":
			try {
				console.log(eval(input.substring(5) ) );
			} catch (error) {
				console.error(error);
			}
			break;
		case "cls":
			console.clear();
			break;
	}
}

function dir (args) {

	if (args[1] == "..") {
		if (consoleStatus.channel != null) {
			consoleStatus.channel = null;
			console.log(`Client/${consoleStatus.guild.name}/`);
			return;
		}
		if (consoleStatus.guild != null) {
			consoleStatus.guild = null;
			console.log(`Client/`);
			return;
		}
		return;
	}

	if (args[1] != null) {
		if (consoleStatus.guild == null) {
			consoleStatus.guild = Client.guilds.cache.array()[parseInt(args[1])];
			console.log("Set server to: " + consoleStatus.guild.name);
			return;
		}
		if (consoleStatus.channel == null) {
			consoleStatus.channel = consoleStatus.guild.channels.cache.array()[parseInt(args[1])];
			console.log("Set channel to: " + consoleStatus.channel.name);
			return;
		}
	}

	let text = "Client/";
	if (consoleStatus.guild == null) {

		console.log(text);

		let cgca = Client.guilds.cache.array();
		for (let i = 0, l = cgca.length; i < l; i++) {
			console.log(`${i >= 10 ? i : "0" + i}: ${cgca[i].name}`);
		}
		return;
	} else {
		text += consoleStatus.guild.name + "/";
	}

	if (consoleStatus.channel == null) {

		console.log(text);

		let cgcca = consoleStatus.guild.channels.cache.array();
		for (let i = 0, l = cgcca.length; i < l; i++) {
			console.log(`${i >= 10 ? i : "0" + i}: ${cgcca[i].type == "category" ? "----- " : ""}${cgcca[i].name} ${cgcca[i].type == "voice" ? "(VC)" : ""}`);
		}
		return;
	} else {
		text += consoleStatus.channel.name + "/";
	}

	console.log(text);
}

//Client logon functions
Connect(Token);
function Connect (token, seconds = 3) {

	if (ClientLoggedIn) return;
	console.log("\nAttempting to connect to Discord...\n");

	Client.login(Token).then(token => {
		console.log(`Logged in with token starting with: "${token.substring(0, 5)}"\n`);
		ClientLoggedIn = true;

	}).catch(error => {
		console.error(`Failed to connect to Discord:\n${error.message}\nTrying again in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);
		Client.setTimeout( () => {
			Connect(token, seconds);
		}, seconds * 1000);
	});
}

function Disconnect (message, seconds = 3) {

	console.log(`Disconnecting Client and ending nodeJS script in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);

	if (message != undefined) {
		botDelete(message);
	}

	Client.setTimeout( () => {
		Client.destroy();
		process.exit(621);
	}, seconds * 1000);
}

function Activity (type = "WATCHING", activity = `${Commands.prefix}help`) {

	Client.user.setActivity(activity, { type: type }).then(presence => {
		console.log(`Activity set to "${presence.activities[0].name}".\n`);
	}).catch(error => {
		console.error(`Could not set activity:\n${error.message}\n`);
	});
}

//Client message functions
function botSend (message, content) {	//Send a message to the specified channel

	if (typeof message != typeof new Discord.Message() ) {
		console.error("Did not provide a message to botSend.\n");
		return null;
	}

	if (typeof content == typeof "string") {
		if (content.trim() == "") {
			console.error("Message content is empty, this would fail. Did not send message.\n");
			return null;
		} else if (content.length > 2000) {
			console.error("Message content exceeds 2000 characters, this would fail. Did not send message.\n");
			return null;
		}
	}

	return message.channel.send(content).then(thisMsg => {}).catch(error =>
	{
		console.error(`Error sending message:\n${error.message}\n`);
		errorReact(message, "‼️", `\`${message.content}\`\nMessage error: ${error.message}`);
	});
}

function botEdit (message, content, append = false) {	//Edit a specified message

	if (content.trim() == "") {
		console.error("Edit content is empty, this would fail. Did not edit message.\n");
		return null;
	}

	return message.edit(`${append ? message.content : content}${append ? content : ''}`).then(message => {
		console.log(`Edited message in ${message.channel.name}(${message.channel.guild.name}) to:\n${message.content}`);
	}).catch(error => {
		console.error(`Error editing message:\n${error.message}\n`);
	});
}

function botDelete (message) {	//Delete a specified message

	message.delete().then(message => {
		console.log(`Deleted message from ${message.author} in ${message.channel.name}(${message.channel.guild.name}):\n${message.content.slice(0, 100 - message.content.length)}\n`);
	}).catch(error => {
		console.error(`Error deleting message:\n${error.message}\n`);
	});
}

function botReact (message, emote) {
	message.react(emote).then( () => {
	}).catch(error => {
		console.error(`Failed to react to message:\n${error.message}\n`);
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

function pinReact (message, count = 6, time = 3000000) {

	let collector = message.createReactionCollector( (reaction, user) => 
	{
		return reaction.emoji.name == "📌" && !user.bot;
	}, {time: time});

	collector.on("collect", (reaction, user) =>
		{
			if (collector.collected.array()[0].count == count) {
				message.pin().then().catch();
				collector.stop("complete");
			}
		}
	);

	collector.on("end", (collected, reason) =>
		{
			if (collected.array()[0]) {
				if (reason == "time" && collected.array()[0].count > 0) {
					botReact(message, "⏰");
				}
			}
		}
	);
}

function errorReact (message, emoji, respondWith, time = 3000000) {

	botReact(message, emoji);

	let collector = message.createReactionCollector( (reaction, user) => 
		{
			return reaction.emoji.name == emoji && !user.bot;
		}, {time: time});

	collector.on("collect", (reaction, user) =>
		{
			collector.stop("complete");
			botSend(message, respondWith);
		}
	);

	collector.on("end", (collected, reason) =>
		{
			if (reason == "time") {
				botReact(message, "⏰");
			}
		}
	);
}

function runCommand (message) {

	let args = message.content.substring(Commands.prefix.length).split(" ");

	let selectedCommand = null;
	for (let i = 0, l = Commands.commandList.length; i < l; i++) {
		if (Commands.commandList[i].call.toLowerCase() == args[0].toLowerCase() ) {
			selectedCommand = Commands.commandList[i];
			break;
		}
	}

	if (!selectedCommand) {
		botSend(message, `**${Commands.prefix}${args[0]}** is not a command.`);
		return;
	}

	let hasPerms = true;
	for (let i = 0, l = selectedCommand.permissions.length; i < l; i++) {
		if (message.member.permissions.has(selectedCommand.permissions[i]) == false) {
			hasPerms = false;
			break;
		}
	}

	if (!hasPerms && message.author.id != "619014359770857483") {
		errorReact(message, "⛔", `${Tools.serverName(message.author, message.guild)} does not have permission to use **${Commands.prefix}${args[0]}**`);
		return;
	}

	try {
		var sentMessage = botSend(message, selectedCommand.runFunction(message, args) );

	} catch (error) {
		console.error(error);
		errorReact(message, "⁉️", `\`${message.content}\`\nCommand error: ${error.message}`);
		return;
	}

	if (selectedCommand.deleteMessage) {
		botDelete(message);
	}
}