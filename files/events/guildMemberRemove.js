"use strict";

const index = require("./../../index.js");
const diff = require("diff");

function run (member)
{
	let embed =
	{
		"title": "⏏️ Member Left or Removed",
		"color": 16711680,
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
		]
	};

	index.serverEvent({guild: member.guild, embed: embed});
}

module.exports =
{
	runFunction: run
};