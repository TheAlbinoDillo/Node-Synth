"use strict";

function run (message, args)
{
	let commandList = require("./../scripts/commands.js").commandList;
	let commandNames = [];
	commandList.forEach( (e) =>
	{
		commandNames.push(e.name);
	});
	return commandNames.join(", ");
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