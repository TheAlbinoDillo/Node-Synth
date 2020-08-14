"use strict";

async function run (message, options)
{
	return makeUwU(options.join(" ") );
}

function makeUwU (string)
{
	string = string.replace(/`/g, "");

	string = string.replace(/(?:r|l)/gi, "w");

	string = string.replace(/n([aeiou])/g, 'ny$1');
	string = string.replace(/N([aeiou])/g, 'Ny$1');
	string = string.replace(/N([AEIOU])/g, 'Ny$1');

	string = string.replace(/ove/g, "uv");

	return "```UωU:\n\n" + string + "```";
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
