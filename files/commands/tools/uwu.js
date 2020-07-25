"use strict";

function makeUwU (string)
{
	string = string.replace(/`/g, "");

	string = string.replace(/(?:r|l)/g, "w");
	string = string.replace(/(?:R|L)/g, "W");

	string = string.replace(/n([aeiou])/g, 'ny$1');
	string = string.replace(/N([aeiou])/g, 'Ny$1');
	string = string.replace(/N([AEIOU])/g, 'Ny$1');

	string = string.replace(/ove/g, "uv");

	return "```UωU:\n\n" + string + "```";
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