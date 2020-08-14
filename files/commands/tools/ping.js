"use strict";

async function run (message, args)
{
	return "Tell Grant to fix this";
}

module.exports =
{
	name: "Ping",
	description: "Ping the bot!",
	calls:
	[
		"ping",
		"marco"
	],
	runFunction: run
};