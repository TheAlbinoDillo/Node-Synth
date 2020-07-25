"use strict";

const Command = require("./../../scripts/commandConst.js");

function run (message, args)
{
	return new Command.PingMessage(message, ["Pong.", "**Pong! **"]);
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