"use strict";

const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{		
	let guild = "704494659400892458";
	let channel = "718827126878371881";
	let content = `**${message.author.username}#${message.author.discriminator}**:\n${args.full}\n`;

	return [new Command.Transpose(content, guild, channel), new Command.ReactEmote(message, "✅")];
}

module.exports =
{
	name: "Request",
	description: "Make a suggestion for bot changes",
	calls:
	[
		"request"
	],
	runFunction: run,
	usage: ["text"]
};