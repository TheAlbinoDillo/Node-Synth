"use strict";

const MathJS = require("mathjs");
const actions = root_require("actions.js");

async function run (options)
{
	let embed =
	{
		title: "Calculator",
		thumbnail:
		{
			url: "https://i.imgur.com/lUBOk8j.png"
		},
		fields: []
	};

	try
	{
		let full = options;
		let answer = MathJS.evaluate(full);
		embed.fields.push(
		{
			name: `${full} =`,
			value: `${answer}`
		});
	}
	catch (error)
	{
		embed.fields.push(
		{
			name: "Error:",
			value: error.message
		});
	}
	actions.send(options, {embed: embed});
}

module.exports =
{
	name: "Calculator",
	description: "Enslave the bot to do math!",
	calls:
	[
		"calculate",
		"calculator",
		"calc"
	],
	run: run,
	usage: ["expression"]
};