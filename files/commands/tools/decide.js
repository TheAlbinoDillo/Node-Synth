"use strict";

const Tools = require("./../../scripts/botTools.js");

async function run (message, args)
{
	let arr = {};
	arr.choices = args.full.split(" ");
	arr.pick = Math.floor(Math.random() * arr.choices.length);
	arr.list = Tools.arrayIntoList(arr.choices);
	arr.choice = arr.choices[arr.pick];

	let embed =
	{
		title: "Decide",
		thumbnail:
		{
			url: "https://i.imgur.com/RTZu7Nn.png"
		},
		fields:
		[
			{
				name: "Deciding from:",
				value: arr.list
			},
			{
				name: "Winner is:",
				value: arr.choice
			}
		]
	};

	return {embed: embed};
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