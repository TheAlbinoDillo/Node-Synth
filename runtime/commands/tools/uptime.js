"use strict";

const MathJS = require("mathjs");
const Actions = script_require("actions.js");

async function run (options)
{
	Actions.send(options, `${options.client.uptime / 1000 / 60} minutes`);
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