"use strict";

function run (message, args)
{
	return Date.now().toString();
}

module.exports =
{
	name: "Time Stamp",
	description: "Get the number of milliseonds since January 1, 1970",
	calls:
	[
		"timestamp"
	],
	runFunction: run
};