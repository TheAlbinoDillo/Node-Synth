"use strict";

const actions = script_require("actions.js");
const index = root_require("index.js");
const diff = require("diff");

const name = "message-edited-node-synth-log";

async function run (oldMessage, newMessage)
{
	//Ignore messages from bots
	if (newMessage.author.bot) return;

	//Get channel
	let channels = newMessage.guild.channels.cache;
	let logChannel = channels.filter( (c) =>
	{
		return c.name === name;

	}).array();

	if (logChannel.length == 0) return;

	let textDiff = diff.diffWords(oldMessage.content, newMessage.content);

	console.log(textDiff);

	let diffString = "";
	for (let i = 0; i < textDiff.length; i++)
	{
		diffString += `${textDiff[i].added ? "+" : ""}${textDiff[i].removed ? "-" : ""}`;
		diffString += `${textDiff[i].added || textDiff[i].removed ? textDiff[i].value + "\n" : ""}`;
	}

	diffString = diffString.replace(/\`/g, "\\`");

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
				"name": "Diff:",
				"value": "```diff\n" + diffString + "\n```"
			},
		]
	};

	actions.send({channel: logChannel[0]}, {embed: embed});
}

module.exports =
{
	run: run
};