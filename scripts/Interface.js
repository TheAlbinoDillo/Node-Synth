"use strict";

const rl = require("readline");

const rlInterface = rl.createInterface
({
	input: process.stdin,
	output: process.stdout
	
}).on("line", (input) =>
{
	let output;
	try
	{
		output = eval(input);
	}
	catch (error)
	{
		output = error;
	}
	console.log(output);
});

module.exports = null;