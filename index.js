"use strict";

//"Import" Dependencies
const Discord = require("discord.js");
const Tools = require("./files/scripts/botTools.js");
const Commands = require("./files/scripts/commands.js");
const Diff = require("diff");
const fs = require("fs");

//Setup Discord Client
const Client = new Discord.Client();
const Token = 'NjYyODI1ODA2OTY3NDcyMTI4.Xqzm2Q.I2y50w7Nu5QmgMqamCI9a3VuxMc';

process.on('uncaughtException', function(error) {
	console.error(error);
	fs.writeFileSync("log.txt", error.stack);
	process.exit();
});

//Client variables
var ClientLoggedIn = false;

//Setup Discord Client Events
Client.on("ready", () =>
{
	console.log("Client is ready\n");

	if (Tools.isDebug) {
		Activity("PLAYING", "Debugging");
	}
});

Client.on("message", message =>
{
	if (message.channel instanceof Discord.DMChannel) return;

	if (message.channel == consoleStatus.channel) {
		console.log(`${message.author.username}:\t${message.content}`);
	}

	//voteHandling(message);

	if (message.content.toLowerCase().indexOf(Commands.prefix) == 0 && message.channel.guild) {
		
		if (message.author.bot) {
			console.log(`Bot (${message.author.username}) tried using a command:\n${message.content}\n`);
		} else {
			runCommand(message);
		}
	}
});

Client.on("messageUpdate", (oldMessage, newMessage) =>
{
	if (newMessage.channel instanceof Discord.DMChannel) return;

	if (oldMessage.author.bot) return;

	if (oldMessage.content == newMessage.content) return;

	serverEvent(newMessage.guild, "📝 Message Edit", newMessage.author, Date.now(), oldMessage, newMessage);

});

Client.on("messageDelete", (message) =>
{
	serverEvent(message.guild, "🗑️ Message Delete", message.author, Date.now(), message);
});

Client.on("guildMemberAdd", member =>
{
	serverEvent(member.guild, "🆕 Member Joined", member.user, Date.now() );
});

Client.on("guildMemberRemove", member =>
{
	serverEvent(member.guild, "⏏️ Member Left or Removed", member.user, Date.now() );
});

function serverEvent (guild, title, user, time, message, edit) {

	let logChannel = Tools.settings.read(guild, "logchannel");
	let channel = guild.channels.cache.get(logChannel);

	if (!logChannel) return;

	let embed = new Discord.MessageEmbed()
	.setTitle(title);

	if (user) {
		embed.setThumbnail(user.displayAvatarURL() )
		.addField("👤 User:", user, true);

		if (!message) embed.addField("❄️ ID:", user.id, true);
	}

	if (time) {
		embed.setTimestamp(time);
	}

	if (message) {

		var text = "Message:";
		if (edit) text = "Original:"

		embed.addField("📲 Channel:", message.channel, true)
		.setFooter(`❄️ ${message.id}`);

		let content = message.content;
		let attachments = message.attachments.array();
		for (let i = 0, l = attachments.length; i < l; i++) {
			content += `\n${attachments[i].proxyURL}`;
		}
		embed.addField(text, content);
	}

	if (edit) {
		let diffText = "";
		let diffObj = Diff.diffWords(message.content, edit.content);
		for (let i in diffObj) {
			let suffix = i == diffObj.length - 1 ? "" : "\n";

			let added = diffObj[i].added ? "+" : "";
			let removed = diffObj[i].removed ? "-" : "";
			if (added || removed) {
				diffText += `${added || removed}${diffObj[i].value}${suffix}`;
			}
		}

		embed.addField("Edited:", edit.content)
		.addField("📥 Difference:", `\`\`\`diff\n${diffText}\`\`\``);
	}

	botSend(channel, embed);
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
					botReact(message, "⏰");
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
	args.shift();

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
					botSend(cmd.message, cmd.content[0]).
					then(message => {
						botEdit(message, cmd.content[1])
						.then(edited => {
							botEdit(edited, `\`${edited.editedTimestamp - message.createdTimestamp}ms\``, true);
						});
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