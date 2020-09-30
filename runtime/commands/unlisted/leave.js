"use strict";

const Actions = script_require("actions.js");

function run (options)
{
	options.client.setTimeout( ()=>
	{
		process.exit();

	}, 100);

	Actions.send(options, "Disconnecting...");
}

module.exports =
{
	run: run,
	calls: ["leave", "quit"]
};