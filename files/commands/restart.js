"use strict";

const Tools = require("./../scripts/botTools.js");

function run (message, args)
{
	Tools.disconnect(message.client, 5);
	return "Restarting...";
}

module.exports =
{
	name: "Restart",
	description: "Restart the bot.",
	calls:
	[
		"restart",
		"reboot"
	],
	runFunction: run,
	permissions: ["BOT_OWNER"]
};