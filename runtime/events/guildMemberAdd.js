"use strict";

const index = require("./../../index.js");
const diff = require("diff");

this.run = (member) =>
{
	let embed =
	{
		"title": "🆕 Member Joined",
		"color": 65280,
		"thumbnail":
		{
			"url": member.user.displayAvatarURL()
		},
		"fields":
		[
			{
				"name": "👤 User:",
				"value": member,
				"inline": true
			},
			{
				"name": "❄️ ID:",
				"value": member.id,
				"inline": true
			}
		],
		"footer":
		{
			"text": "Account created"
		},
		"timestamp": new Date(member.user.createdTimestamp).toJSON()
	};

	index.serverEvent({guild: member.guild, embed: embed});
};