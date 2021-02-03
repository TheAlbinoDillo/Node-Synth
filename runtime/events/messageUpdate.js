"use strict";

const actions = script_require("actions.js");
const index = root_require("index.js");
const diff = require("diff");

// Name of channel the log will be sent
const name = "message-edited-node-synth-log";

async function run (oldMessage, newMessage)
{
	// Ignore if message has no guild
	// This usually means it's a DM message
	if (!oldMessage.guild) return;

	// Ignore edited messages from bots
	if (newMessage.author.bot) return;

	// Get channel of edited message
	let channels = newMessage.guild.channels.cache;
	let logChannel = channels.filter( (c) =>
	{
		return c.name === name;

	}).array();

	// Do nothing if a log channel has not been made
	if (logChannel.length == 0) return;

	// Get difference of messages
	let textDiff = diff.diffWords(oldMessage.content, newMessage.content);

	// From difference string for embed
	let diffString = "";
	for (let i = 0; i < textDiff.length; i++)
	{
		diffString += `${textDiff[i].added ? "+" : ""}${textDiff[i].removed ? "-" : ""}`;
		diffString += `${textDiff[i].added || textDiff[i].removed ? textDiff[i].value + "\n" : ""}`;
	}

	diffString = diffString.replace(/\`/g, "\\`");

	// Create embed
	let embed =
	{
		"title": "Message edited",
		"color": 16760399,
		"thumbnail":
		{
			"url": newMessage.author.avatarURL()
		},
		"fields":
		[
			{
				"name": "User:",
				"value": `${newMessage.author}`,
				"inline": true
			},
			{
				"name": "Channel:",
				"value": `${newMessage.channel}`,
				"inline": true
			},
			{
				"name": "Old:",
				"value": `${oldMessage.content}`
			},
			{
				"name": "New:",
				"value": `${newMessage.content}`
			},
			{
				"name": "Difference:",
				"value": "```diff\n" + diffString + "\n```"
			},
		]
	};

	// Send embed to the log channel
	actions.send({channel: logChannel[0]}, {embed: embed});
}

module.exports =
{
	run: run
};