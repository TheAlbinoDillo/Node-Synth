"use strict";

function run (options)
{
	BotActions.send(options, options.full);
	options.message.delete().catch();
}

module.exports =
{
	name: "Echo",
	perms: ["ADMINISTRATOR"],
	run: run
};
