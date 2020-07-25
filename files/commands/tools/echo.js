"use strict";

module.exports =
{
	name: "Echo",
	description: "Make the bot say what you say",
	calls:
	[
		"echo"
	],
	runFunction: (message, args) =>
	{
		if (!args.full) return "_ _";
		
		return args.full.trim();
	},
	usage: ["text"],
	deleteMessage: true,
	permissions: ["MANAGE_MESSAGES"]
};