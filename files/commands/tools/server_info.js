"use strict";

const Tools = require("./../../scripts/botTools.js");

async function run (message, args)
{
	let g = message.guild;
	let url = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;

	let embed =
	{
		title: `Information for ${g.name}`,
		thumbnail:
		{
			url: url
		},
		fields:
		[
			{
				name: "Server Owner:",
				value: Tools.serverName(g.owner.user, g),
				inline: true
			},
			{
				name: "Created On:",
				value: `${g.createdAt.toLocaleString('default',{month:'long'})} ${g.createdAt.getFullYear()}`,
				inline: true
			},
			{
				name: "Member Count:",
				value: `${g.memberCount} users`,
				inline: true
			}
		],
		footer:
		{
			text: `${g.region} • ${g.id} • ${g.owner.user.username}#${g.owner.user.discriminator}`
		}
	};

	return {embed: embed};
}

module.exports =
{
	name: "Server Information",
	description: "Get information about the server.",
	calls:
	[
		"sinfo",
		"serverinfo"
	],
	runFunction: run
};