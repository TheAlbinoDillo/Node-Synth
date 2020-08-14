"use strict";

async function run (message, args)
{
	let commandList = require("./../../scripts/commands.js").commandList;
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

	let embed =
	{
		title: `Help for ${message.client.user.username}`,
		thumbnail:
		{
			url: "https://i.imgur.com/zfVwbiK.png"
		},
		fields: []
	};

	for (let category in commandCategories)
	{
		if (category === "unlisted") continue;

		embed.fields.push(
		{
			name: category,
			value: commandCategories[category].join(", ")
		});
	}
	return {embed: embed};
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