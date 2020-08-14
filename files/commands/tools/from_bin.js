"use strict";

async function run (message, args)
{
	return parseInt(args.full, 2).toString();
}

module.exports =
{
	name: "From Binary",
	description: "Turn binary into a decimal number!",
	calls:
	[
		"frombin"
	],
	runFunction: run,
	usage: ["binary number"]
};