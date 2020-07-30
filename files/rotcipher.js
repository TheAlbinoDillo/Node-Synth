"use strict";

const Discord = require("discord.js");
const Command = require("./../../scripts/commandConst.js");

const alpha = "abcdefghijklmnopqrstuvwxyz".split("");

function circ (num, max)
{
	if (num > max) return max - num;

	return num;
}

function rotate (text, rot)
{
	let output = "";
	let caps = [];

	for (let i = 0, l = text.length; i < l; i++)
	{
		caps.push(alpha.includes(text[i]) );
		
		else
		{
			output += text[i];
		}
	}
	return output;
}

function run (message, args)
{
	let rotations = "";
	for (let i = 0, l = alpha.length; i < l; i++)
	{
		rotations += rotate(args.full, i) + "\n";
	}

	let embed = new Discord.MessageEmbed()
	.setTitle("Caesar cipher")
	.addField("Original:", args.full)
	.addField("Rotations:", rotations);

	return new Command.TextMessage(message, embed);
}

module.exports =
{
	name: "Caesar cipher",
	description: "Rotate text into or out of a cipher!",
	calls:
	[
		"rotate",
		"caesar"
	],
	runFunction: run,
	usage: ["text"]
};