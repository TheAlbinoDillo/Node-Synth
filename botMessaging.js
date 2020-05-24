const Discord = require("discord.js");
var consoleLogging = { enabled: false, user: undefined };

module.exports = {
	botSend: botSend,
	botEdit: botEdit,
	botDelete: botDelete,
	botReact: botReact,
	botSendDM: botSendDM,
	botLog: botLog,
	botError: botError,
	consoleLogging: consoleLogging
};

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