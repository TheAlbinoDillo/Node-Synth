"use strict";

const Discord = require("discord.js");
const Actions = root_require("actions.js");
const Commands = root_require("commands.js");

async function run (options)
{
	let categories = Commands.command_list.get_categories();
	
	let embed = new Discord.MessageEmbed()
	.setTitle(`Help for ${options.client.user.username}`)
	.setThumbnail("https://i.imgur.com/zfVwbiK.png");

	for (let category in categories)
	{
		let command_calls = [];
		for (let command in categories[category])
		{
			command_calls.push(categories[category][command].calls[0]);
		}

		if (category === "unlisted") continue;

		embed.addField
		(
			category,
			command_calls.join(", ")
		);
	}

	Actions.send(options, embed);
}

module.exports =
{
	name: "Help",
	calls: ["help", "?"],
	perms: [],
	run: run
}