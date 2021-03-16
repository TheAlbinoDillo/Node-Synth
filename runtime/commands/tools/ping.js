"use strict";

const MathJS = require("mathjs");

async function run (options)
{
	let sent = await BotActions.send(options, "Pong.");

	sent.edit(`**Pong!** \`${sent.createdTimestamp - options.message.createdTimestamp}\`ms`);
}

module.exports =
{
	name: "Ping",
	run: run,
	perms: []
};