"use strict";

const MathJS = require("mathjs");

async function run (options)
{
	BotActions.send(options, `${options.client.uptime / 1000 / 60} minutes`);
}

module.exports =
{
	name: "Up Time",
	calls:
	[
		"uptime"
	],
	run: run,
	perms: []
};