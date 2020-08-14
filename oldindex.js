"use strict";

//"Import" Dependencies
const discord = require("discord.js");
const tools = require("./files/scripts/botTools.js");
const commands = require("./files/scripts/commands.js");
const debug = require("./files/scripts/runningOnPi.js");
const fs = require("fs");

//Setup discord client
const client = new discord.Client();
const token = tools.token;
const ownerID = tools.owner;

client.botSend = botSend;

//Log all uncaught errors to log file and exit process
process.on('uncaughtException', (error) =>
{
	console.error(error);
	fs.writeFileSync("log.txt", Date.now + "\n" + error.stack);
	process.exit();
});


function setupEvents ()
{
	let eventsPath = "./files/events";
	let eventsDir = fs.readdirSync(eventsPath);
	eventsDir.forEach( (e) =>
	{
		let ext = ".js";
		let withoutExt = e.substring(0, e.length - ext.length);
	
		let runFunction = require(`${eventsPath}/${withoutExt}`).runFunction;
		client.on(withoutExt, (arg1, arg2) =>
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
}

//Setup discord client Events
client.on("ready", () =>
{
	setupEvents();

	console.log("Client is ready\n");

	if (debug)
	{
		Activity("PLAYING", "Debugging");
	}
	else
	{
		Activity("PLAYING", "fg.help");
	}
});

function serverEvent (argsObj)
{
	let logChannel = tools.settings.read(argsObj.guild, "logchannel");
	let channel = argsObj.guild.channels.cache.get(logChannel);

	if (!logChannel) return;

	botSend(channel, {embed: argsObj.embed});
}

//client logon functions
Connect(token);
function Connect (token, seconds = 3) {

	if (ClientLoggedIn === undefined)
	{
		var ClientLoggedIn = false;
	}

	if (ClientLoggedIn) return;
	console.log("\nAttempting to connect to discord...\n");

	client.login(token).then(token =>
	{
		console.log(`Logged in with token starting with: "${token.substring(0, 5)}"\n`);
		ClientLoggedIn = true;

	}).catch(error =>
	{
		console.error(`Failed to connect to discord:\n${error.message}\nTrying again in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);
		client.setTimeout( () =>
		{
			Connect(token, seconds);
		}, seconds * 1000);
	});
}

function Activity (type = "WATCHING", activity = `${commands.prefix}help`) {

	client.user.setActivity(activity, { type: type }).then(presence => {
		//console.log(`Activity set to "${presence.activities[0].name}".\n`);
	}).catch(error => {
		console.error(`Could not set activity:\n${error.message}\n`);
	});
}

//client message functions
function botSend (channel, content) {	//Send a message to the specified channel

	let message;
	if (channel instanceof discord.Message) {
		message = channel;
		channel = channel.channel;
	}

	if (!(channel instanceof discord.TextChannel) ) {
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

function errorReact (message, emoji, respondWith, time = 180000) {

	botReact(message, emoji);

	let collector = message.createReactionCollector( (reaction, user) => 
		{
			return reaction.emoji.name === emoji && !user.bot;
		}, {time: time});

	collector.on("collect", (reaction, user) =>
		{
			collector.stop("complete");
			botSend(message, respondWith);
		}
	);

	collector.on("end", (collected, reason) =>
		{
			if (reason === "time") {
				botReact(message, "⏰");
			}
		}
	);
}

function runCommand (message) {

	if (message.mentions.users.size > 0) {
		message.content = message.content.replace("<@", " <@");
	}

	let commandExp = /(?<prefix>^fg(?:\. |[^a-z0-9?]))(?<command>[^\s]+) ?(?<args>.+)*/gi;
	let argsExp = /[^\s]+|(?:"[^"]*"|`[^`]*`|'[^']*')/g;

	let test = commandExp.exec(message.content);

	let options = [];
	if (test.groups.args)
	{
		options = test.groups.args.match(argsExp);
	}

	let selectedCommand = null;
	for (let i = 0, l = commands.commandList.length; i < l; i++) {
		if (commands.commandList[i].calls.includes(test.groups.command.toLowerCase() ) ) {
			selectedCommand = commands.commandList[i];
			break;
		}
	}

	if (!selectedCommand) {
		botSend(message, `**${test.groups.command}** is not a command.`);
		return;
	}

	let hasPerms = true;
	for (let i = 0, l = selectedCommand.permissions.length; i < l; i++)
	{
		let scpi = selectedCommand.permissions[i];

		if (scpi === "BOT_OWNER")
		{
			if (message.author.id != ownerID)
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

	if (!hasPerms && message.author.id != ownerID) {
		errorReact(message, "⛔", `${tools.serverName(message.author, message.guild)} does not have permission to use **${test.groups.command}**`);
		return;
	}

	command: try {
		let value = selectedCommand.runFunction(message, options);

		if (value instanceof Promise)
		{
			value.then( (msg) =>
			{
				botSend(message, msg);

			}).catch( (err) =>
			{
				errorReact(message, "🤷", err.stack);
			});

			break command;
		}

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
					let channel = client.guilds.cache.get(cmd.guild).channels.cache.get(cmd.channel);
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

class ReactionFunction
{
	constructor(emoji, func)
	{
		
	};
}

module.exports =
{
	serverEvent: serverEvent,
	runCommand: runCommand,
	botSend: botSend
};