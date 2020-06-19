"use strict";

//"Import" Dependencies
const Discord = require("discord.js");
const ReadLine = require("readline");
const Tools = require("./files/scripts/botTools.js");
const Commands = require("./files/scripts/commands.js");
const Diff = require("diff");

//Setup Discord Client
const Client = new Discord.Client();
const Token = 'NjYyODI1ODA2OTY3NDcyMTI4.Xqzm2Q.I2y50w7Nu5QmgMqamCI9a3VuxMc';

//Client variables
var ClientLoggedIn = false;

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
Client.on("messageDelete", (message) =>
	{
		ClientOnMessageDelete(message);
	}
);
Client.on("guildMemberAdd", member =>
	{
		ClientOnGuildMemberAdd(member);
	}
);

//Setup Interface Events
Interface.on('line', (input) => { InterfaceOnLine(input); });

//Discord Called Events
function ClientOnReady () {	//Called when after Discord Client is logged in

	if (Tools.isDebug) {
		Activity("PLAYING", "Debugging");
	}
}

function voteHandling (message) {

	let channelSettings = Tools.settings.read(message.guild, "channels");
	if (channelSettings == null) {
		return;
	}

	if (channelSettings[message.channel.id] == null) {
		return;
	}

	let voteSetting = channelSettings[message.channel.id]["vote"];
	if (!voteSetting || voteSetting == "off") {
		return;
	}

	let react = function () {
		botReact(message, ":symbol_reddit_vote_up:680935204050698329");
		botReact(message, ":symbol_reddit_vote_down:680935348272103445");
	}

	if (voteSetting == "images" && !message.author.bot) {

		let maa = message.attachments.array()[0];
		if (maa != null) {
			if (maa.width != null) {
				react();
			}
		}
		return;
	}

	if (voteSetting == "all") {
		react();
		return;
	}
}

function ClientOnMessage (message) {	//Called when the Client receives a message

	voteHandling(message);

	if (message.content.toLowerCase().indexOf(Commands.prefix) == 0 && message.channel.guild) {
		
		if (message.author.bot) {
			console.log(`Bot (${message.author.username}) tried using a command:\n${message.content}\n`);
		} else {
			runCommand(message);
		}
	}
}

function ClientOnMessageUpdate (oldMessage, newMessage) {	//Called when the Client receives a message edit

	let logChannel = Tools.settings.read(newMessage.guild, "logchannel");
	if (logChannel && !oldMessage.author.bot) {
		let embed = new Discord.MessageEmbed()
		.setTitle("📝 Message Edit")
		.addField("👤 User:", oldMessage.author, true)
		.addField("📲 Channel:", oldMessage.channel, true)
		.addField("Original:", oldMessage.content)
		.addField("Edited:", newMessage.content);

		let diffText = "```diff\n";
		let diffObj = Diff.diffWords(oldMessage.content, newMessage.content);
		for (let i in diffObj) {
			let suffix = i == diffObj.length - 1 ? "" : "\n";
			if (diffObj[i].added) {
				diffText += `+${diffObj[i].value}${suffix}`;
			} else
			if (diffObj[i].removed) {
				diffText += `-${diffObj[i].value}${suffix}`;
			}
		}

		embed.addField("📥 Difference:", `${diffText}\`\`\``)
		.setFooter(`❄️ ${oldMessage.id} • 🗓️ ${new Date(oldMessage.createdTimestamp).toLocaleTimeString()} EST`);

		let channel = oldMessage.guild.channels.cache.get(logChannel);

		botSend(channel, embed);
	}
}

function ClientOnMessageDelete (message) {	//Called when the Client receives a message edit

	let logChannel = Tools.settings.read(message.guild, "logchannel");
	if (logChannel && !message.author.bot) {
		let embed = new Discord.MessageEmbed()
		.setTitle("🗑️ Message Delete")
		.addField("👤 User:", message.author, true)
		.addField("📲 Channel:", message.channel, true)
		.addField("Message:", message.content)
		.setFooter(`❄️ ${message.id} • 🗓️ ${new Date(oldMessage.createdTimestamp).toLocaleTimeString()} EST`);

		let channel = message.guild.channels.cache.get(logChannel);

		botSend(channel, embed);
	}
}

function ClientOnGuildMemberAdd (member) {

	let embed = new Discord.MessageEmbed()
	.setTitle("🆕 Member Joined")
	.setThumbnail(member.displayAvatarURL() )
	.addField("👤 User:", member.user, true)
	.addField("❄️ ID:", member.id, true)
	.addField("Creation:", `${new Date(member.user.createdAt).toLocaleTimeString()} EST`, true)
	.setFooter(`🗓️ ${new Date(oldMessage.createdTimestamp).toLocaleTimeString()} EST`);

	let channel = message.guild.channels.cache.get(logChannel);

	botSend(channel, embed);	
}

//ReadLine Interface Called Events
function InterfaceOnLine (input) {	//Called when the console receives command line input
let args=input.split(" ");switch(args[0]){case "leave":Tools.disconnect(Client);break;case "eval":try{console.log(eval(input.substring(5)))}catch(error){console.error(error)}break;case "cls":console.clear();break}}

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

	if (!channel instanceof Discord.Channel) {
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

	//console.log(channel);

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