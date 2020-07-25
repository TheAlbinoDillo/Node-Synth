"use strict";

const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	let arr = {};
	arr.choices = args.full.split(" ");
	arr.pick = Math.floor(Math.random() * arr.choices.length);
	arr.list = Tools.arrayIntoList(arr.choices);
	arr.choice = arr.choices[arr.pick];

	let text = `Deciding from:\n${arr.list}\nWinner is: **${arr.choice}**`;

	return text;
}

module.exports =
{
	name: "Decide",
	description: "Randomly decide from values",
	calls:
	[
		"decide",
		"dec"
	],
	runFunction: run,
	usage: ["option1","option2","option.."]
};