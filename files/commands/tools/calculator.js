"use strict";

const MathJS = require("mathjs");

function run (message, args)
{
	return calculate(args.full);
}

function calculate (expression)
{
	let text = "";

	if (!expression) return "Provide an expression to calculate."

	try
	{
		let answer = MathJS.evaluate(expression);
		text = `\`${expression}\` = **${answer}**`;
	}
	catch (error)
	{
		text = error.message;
	}

	return text;
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
	runFunction: run,
	usage: ["expression"]
};