"use strict";

async function run (message, args)
{
	let embed =
	{
		title: "Reverse Text",
		fields:
		[
			{
				name: "Original:",
				value: args.full
			},
			{
				name: "Reversed:",
				value: reverse(args.full)
			}
		]
	};

	return {embed: embed};
}

function reverse (text)
{
	let output = "";
	for (let i = text.length - 1; i >= 0; i--)
	{
		output += text[i];
	}
	return output;
}

module.exports =
{
	name: "Reverse",
	description: "Reverse some text!",
	calls:
	[
		"reverse",
		"rvtxt"
	],
	runFunction: run,
	usage: ["text"]
};