"use strict";

const Command = require("./../../scripts/commandConst.js");

function run (message, args)
{
	let display = ["Pong.", "**Pong! **"];

	if (message.content.indexOf("marco") === 3)
	{
		display = ["Polo.", "**Polo! **"];
	}

	return new Command.PingMessage(message, display);
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