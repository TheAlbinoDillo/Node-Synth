"use strict";

async function run (options)
{
	options.client.setTimeout( () =>
	{
		process.exit();

	}, 500);

	BotActions.send(options, "Disconnecting...");
}

module.exports =
{
	run: run,
	name: "leave",
	calls: ["leave", "quit"],
	perms: ["BOT_OWNER"]
};