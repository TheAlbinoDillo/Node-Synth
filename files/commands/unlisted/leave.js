"use strict";

const Tools = require("./../../scripts/botTools.js");

async function run (message, args)
{
	Tools.disconnect(message.client, 2);
	return "Disconnecting...";
}

module.exports =
{
	name: "Leave",
	description: "Disconnect the bot.",
	calls:
	[
		"leave"
	],
	runFunction: run,
	permissions: ["BOT_OWNER"]
};