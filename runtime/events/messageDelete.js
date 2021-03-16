"use strict";

const name = "message-deleted-node-synth-log";

async function run (message)
{
	//Ignore messages from bots
	if (message.author.bot) return;

	//Get channel
	let channels = message.guild.channels.cache;
	let logChannel = channels.filter( (c) =>
	{
		return c.name === name;

	}).array();

	if (logChannel.length == 0) return;

	let embed =
	{
		"title": "Message Deleted",
		"color": 14093067,
		"thumbnail":
		{
			"url": message.author.avatarURL()
		},
		"fields":
		[
			{
				"name": "User:",
				"value": `${message.author}`,
				"inline": true
			},
			{
				"name": "Channel:",
				"value": `${message.channel}`,
				"inline": true
			},
			{
				"name": "Message:",
				"value": `${message.content || "`No message content.`"}`
			}
		]
	};

	BotActions.send({channel: logChannel[0]}, {embed: embed});
}

module.exports =
{
	run: run
};