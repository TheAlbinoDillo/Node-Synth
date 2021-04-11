"use strict";

const Discord = require("discord.js");

async function run (options)
{
	let nsfw = options.channel.nsfw;
	let embed =
	{
		title: `Commands for ${VarClient.user.username}`,
		description: "Usage: `fg <command>`",
		thumbnail:
		{
			url: "https://i.imgur.com/zfVwbiK.png"
		},
		fields: makeFields(nsfw),
		footer:
		{
			text: nsfw ? "" : "* NSFW commands not shown.\nRun this command in a NSFW channel to view."
		}
	};

	BotActions.send(options, {embed: embed});
}

function makeField (name, value)
{
	let obj =
	{
		name: name,
		value: value
	};
	return obj;
}

function makeFields (isNSFW)
{
	let fields = [];

	for (let categoryName in VarCommandCategories)
	{
		// Skip category if in unlisted folder
		if (categoryName === "unlisted")
			continue;

		let calls = [];
		let category = VarCommandCategories[categoryName];

		// Compile command calls into array
		let anyRejected = false;
		category.forEach( (e, i) =>
		{
			let command = VarCommandList[e];

			// Ignore NSFW commands if in SFW channel
			if (command.nsfw && !isNSFW)
				return anyRejected = true;

			calls.push(command.calls[0]);
		});

		// Add category to embed field
		fields.push(makeField(`${categoryName}${anyRejected ? "*" : ""}`, calls.join(", ") ) );
	}
	return fields;
}

module.exports =
{
	name: "Help",
	calls: ["help", "?", "commands"],
	perms: [],
	run: run
}