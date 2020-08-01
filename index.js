"use strict";

//"Import" Dependencies
const Discord = require("discord.js");
const Tools = require("./files/scripts/botTools.js");
const Commands = require("./files/scripts/commands.js");
const debug = require("./files/scripts/runningOnPi.js");
const fs = require("fs");

//Setup Discord Client
const Client = new Discord.Client();
const Token = Tools.token;
const OwnerID = "619014359770857483";

process.on('uncaughtException', function(error) {
	console.error(error);
	fs.writeFileSync("log.txt", error.stack);
	process.exit();
});

//Setup Discord Client Events
Client.on("ready", () =>
{
	let eventsPath = "./files/events";
	let eventsDir = fs.readdirSync(eventsPath);
	eventsDir.forEach( (e) =>
	{
		let ext = ".js";
		let withoutExt = e.substring(0, e.length - ext.length);
	
		let runFunction = require(`${eventsPath}/${withoutExt}`).runFunction;
		Client.on(withoutExt, (arg1, arg2) =>
		{
			try
			{
				runFunction(arg1, arg2);
			}
			catch (error)
			{
				console.error(error);
			}
		});
	});

	console.log("Client is ready\n");

	if (debug) {
		Activity("PLAYING", "Debugging");
	}
});

function serverEvent (argsObj) {

	let logChannel = Tools.settings.read(argsObj.guild, "logchannel");
	let channel = argsObj.guild.channels.cache.get(logChannel);

	if (!logChannel) return;

	botSend(channel, {embed: argsObj.embed});
}

Client.on("message", (message) =>
{
	if (message.channel instanceof Discord.DMChannel) return;

	if (message.content.toLowerCase().indexOf(Commands.prefix) == 0 && message.channel.guild) {
		
		if (message.author.bot) {
			console.log(`Bot (${message.author.username}) tried using a command:\n${message.content}\n`);
		} else {
			runCommand(message);
		}
	}
});

//Client logon functions
Connect(Token);
function Connect (token, seconds = 3) {

	if (ClientLoggedIn === undefined)
	{
		var ClientLoggedIn = false;
	}

	if (ClientLoggedIn) return;
	console.log("\nAttempting to connect to Discord...\n");

	Client.login(Token).then(token =>
	{
		console.log(`Logged in with token starting with: "${token.substring(0, 5)}"\n`);
		ClientLoggedIn = true;

	}).catch(error =>
	{
		console.error(`Failed to connect to Discord:\n${error.message}\nTrying again in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);
		Client.setTimeout( () =>
		{
			Connect(token, seconds);
		}, seconds * 1000);
	});
}

function Activity (type = "WATCHING", activity = `${Commands.prefix}help`) {

	Client.user.setActivity(activity, { type: type }).then(presence => {
		//console.log(`Activity set to "${presence.activities[0].name}".\n`);
	}).catch(error => {
		console.error(`Could not set activity:\n${error.message}\n`);
	});
}

//Client message functions
function botSend (channel, content) {	//Send a message to the specified channel

	let message;
	if (channel instanceof Discord.Message) {
		message = channel;
		channel = channel.channel;
	}

	if (!(channel instanceof Discord.TextChannel) ) {
		console.error("Did not provide a channel to botSend.\n");
		return null;
	}

	if (typeof content === 'string' || content instanceof String) {
		if (content.trim() == "") {
			console.error("Message content is empty, this would fail. Did not send message.\n");
			return null;
		} else if (content.length > 2000) {
			console.error("Message content exceeds 2000 characters, this would fail. Did not send message.\n");
			return null;
		}
	}

	let sent = channel.send(content);

	sent.then(message => {}).catch(error =>
	{
		console.error(`Error sending message:\n${error.message}\n`);
		if (message) {
			errorReact(message, "‼️", `\`${message.content}\`\nMessage error: ${error.message}`);
		}
	});

	return sent;
}

function botEdit (message, content, append = false) {	//Edit a specified message

	if (content.trim() == "") {
		console.error("Edit content is empty, this would fail. Did not edit message.\n");
		return null;
	}

	let edit = message.edit(`${append ? message.content : content}${append ? content : ''}`);

	edit.then(message => {
		//console.log(`Edited message in ${message.channel.name}(${message.channel.guild.name}) to:\n${message.content}`);
	}).catch(error => {
		console.error(`Error editing message:\n${error.message}\n`);
	});

	return edit;
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
					botReact(message, "⌚");
				}
			}
		}
	);
}

function errorReact (message, emoji, respondWith, time = 180000) {

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

	if (message.mentions.users.size > 0) {
		message.content = message.content.replace("<@", " <@");
	}

	let args = message.content.substring(Commands.prefix.length).split(" ");

	let selectedCommand = null;
	for (let i = 0, l = Commands.commandList.length; i < l; i++) {
		if (Commands.commandList[i].calls.includes(args[0].toLowerCase() ) ) {
			selectedCommand = Commands.commandList[i];
			break;
		}
	}

	if (!selectedCommand) {
		botSend(message, `**${Commands.prefix}${args[0]}** is not a command.`);
		return;
	}

	args.full = message.content.substring(args[0].length + Commands.prefix.length + 1);
	args.command = `${Commands.prefix}${args[0]}`;
	args.shift();

	let hasPerms = true;
	for (let i = 0, l = selectedCommand.permissions.length; i < l; i++)
	{
		let scpi = selectedCommand.permissions[i];

		if (scpi === "BOT_OWNER")
		{
			if (message.author.id != OwnerID)
			{
				hasPerms = false;
				break;				
			}
			continue;
		}

		if (message.member.permissions.has(scpi) === false)
		{
			hasPerms = false;
			break;
		}
	}

	if (!hasPerms && message.author.id != OwnerID) {
		errorReact(message, "⛔", `${Tools.serverName(message.author, message.guild)} does not have permission to use **${args.command}**`);
		return;
	}

	command: try {
		let value = selectedCommand.runFunction(message, args);

		if (!value) {
			break command;
		}

		if (typeof value === 'string' || value instanceof String) {
			botSend(message, value);
			break command;
		}

		if (!Array.isArray(value) ) {
			value = [value];
		}

		for (let i in value) {

			let cmd = value[i];
			switch (cmd.type) {
				case "text":
					botSend(cmd.message, cmd.content);
					break;
				case "transpose":
					let channel = Client.guilds.cache.get(cmd.guild).channels.cache.get(cmd.channel);
					botSend(channel, cmd.content);
					break;
				case "react":
					botReact(cmd.message, cmd.content);
					break;
				case "ping":
					botSend(cmd.message, cmd.content[0]). then(pingmessage =>
					{
						let pingtime = pingmessage.createdTimestamp - message.createdTimestamp;

						botEdit(pingmessage, `${cmd.content[1]}\`${pingtime}ms\``);
					});
					break;
			}
		}

	} catch (error) {
		console.error(error);
		errorReact(message, "⁉️", `\`${message.content}\`\nCommand error: ${error.message}`);
		return;
	}

	if (selectedCommand.deleteMessage) {
		botDelete(message);
	}
}

module.exports =
{
	serverEvent: serverEvent
};