"use strict";

const index = require("./../../index.js");

function run (message)
{
	let embed =
	{
		"title": "🗑️ Message Delete",
		"color": 16711680,
		"thumbnail":
		{
			"url": message.author.displayAvatarURL()
		},
		"fields":
		[
			{
				"name": "👤 User:",
				"value": message.author,
				"inline": true
			},
			{
				"name": "📲 Channel:",
				"value": message.channel,
				"inline": true
			},
			{
				"name": "Message:",
				"value": message.content || "undefined"
			}
		],
		"footer":
		{
			"text": `❄️ ${message.id}`
		},
		"timestamp": new Date(message.createdTimestamp).toJSON()
	};

	index.serverEvent({guild: message.guild, embed: embed});
}

module.exports =
{
	runFunction: run
};