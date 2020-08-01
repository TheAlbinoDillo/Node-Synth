"use strict";

const index = require("./../../index.js");
const diff = require("diff");

function run (oldMessage, newMessage)
{
	if (newMessage.author.bot) return;

	let diffText = "";
	let diffObj = diff.diffWords(oldMessage.content, newMessage.content);

	for (let i in diffObj)
	{
		let suffix = i == diffObj.length - 1 ? "" : "\n";

		let added = diffObj[i].added ? "+" : "";
		let removed = diffObj[i].removed ? "-" : "";
		if (added || removed)
		{
			diffText += `${added || removed}${diffObj[i].value}${suffix}`;
		}
	}
	diffText = "```diff\n" + diffText + "```";

	let embed =
	{
		"title": "📝 Message Edit",
		"color": 16771840,
		"thumbnail":
		{
			"url": newMessage.author.displayAvatarURL()
		},
		"fields":
		[
			{
				"name": "👤 User:",
				"value": newMessage.author,
				"inline": true
			},
			{
				"name": "📲 Channel:",
				"value": newMessage.channel,
				"inline": true
			},
			{
				"name": "Original:",
				"value": oldMessage.content || "undefined"
			},
			{
				"name": "Edited:",
				"value": newMessage.content || "undefined"
			},
			{
				"name": "📥 Difference:",
				"value": diffText || "undefined"
			}
		],
		"footer":
		{
			"text": `❄️ ${oldMessage.id}, ${newMessage.id}`
		},
		"timestamp": new Date(oldMessage.createdTimestamp).toJSON()
	};

	index.serverEvent({guild: newMessage.guild, embed: embed});
}

module.exports =
{
	runFunction: run
};