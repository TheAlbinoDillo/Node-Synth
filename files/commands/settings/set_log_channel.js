"use strict";

const Tools = require("./../../scripts/botTools.js");

async function run (message, args)
{		
	let value = message.channel.id;
	Tools.settings.write(message.guild, "logchannel", value);

	return "Channel set as log channel!";
}

module.exports =
{
	name: "Set Log Channel",
	description: "Set this channel as the logging channel",
	calls:
	[
		"setlogchannel"
	],
	runFunction: run,
	permissions: ["ADMINISTRATOR"]
};