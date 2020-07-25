"use strict";

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
		commandCategories[e.category].push(e.name);
	});

	let text = "";
	for (let category in commandCategories)
	{
		text += `**${category}:**\n${commandCategories[category].join(", ")}\n`;
	}
	return text;
}

module.exports =
{
	name: "List Commands",
	description: "List all the commands this bot has to offer.",
	calls:
	[
		"listcmd",
		"listcommands"
	],
	runFunction: run
};