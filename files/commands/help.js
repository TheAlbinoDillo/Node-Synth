"use strict";

const Discord = require("discord.js");
const Command = require("./../scripts/commandConst.js");

function run (message, args)
{
	let commandList = require("./../scripts/commands.js").commandList;
	let commandCategories = {};

	commandList.forEach( (e) =>
	{
		if (commandCategories[e.category] === undefined)
		{
			commandCategories[e.category] = [];
		}
	});
	
	commandList.forEach( (e) =>
	{
		commandCategories[e.category].push(e.calls[0]);
	});

	let Client = message.client;

	let embed = new Discord.MessageEmbed()
	.setTitle(`Help for ${Client.user.username}`)
	.setThumbnail(Client.user.avatarURL() );

	for (let category in commandCategories)
	{
		if (category === "unlisted") continue;

		embed.addField(category, commandCategories[category].join(", ") );
	}
	return new Command.TextMessage(message, embed);
}

module.exports =
{
	name: "Help",
	description: "Get help with commands",
	calls:
	[
		"help",
		"helpme",
		"?"
	],
	runFunction: run
};