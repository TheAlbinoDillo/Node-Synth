"use strict";

const Discord = require("discord.js");
const Command = require("./../../scripts/commandConst.js");
const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	let arr = {};
	arr.choices = args.full.split(" ");
	arr.pick = Math.floor(Math.random() * arr.choices.length);
	arr.list = Tools.arrayIntoList(arr.choices);
	arr.choice = arr.choices[arr.pick];

	let embed = new Discord.MessageEmbed()
	.setThumbnail("https://i.imgur.com/0GaxXO3.png")
	.addField("Deciding from:", arr.list)
	.addField("Winner is:", arr.choice);

	return new Command.TextMessage(message, embed);
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