"use strict";

const MathJS = require("mathjs");
const actions = root_require("actions.js");

async function run (options)
{
	let sent = await actions.send(options, "Pong.");

	sent.edit(`**Pong!** \`${sent.createdTimestamp - options.message.createdTimestamp}\`ms`);
}

module.exports =
{
	name: "Ping",
	run: run,
	perms: []
};