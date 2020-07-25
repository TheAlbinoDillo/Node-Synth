"use strict";

function makeUwU (string)
{
	let text =
	string.replace(/R/g, 'W')
	.replace(/r/g, 'w')
	.replace(/L/g, 'W')
	.replace(/l/g, 'w');

	return text;
}

function run (message, args)
{
	return makeUwU(args.full);
}

module.exports =
{
	name: "UwU Speak",
	description: "Convert to UwU speak!",
	calls:
	[
		"uwu",
		"uwuspeak"
	],
	runFunction: run
};