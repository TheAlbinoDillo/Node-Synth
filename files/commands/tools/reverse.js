"use strict";

const Discord = require("discord.js");
const Command = require("./../../scripts/commandConst.js");

function reverse (text)
{
	let output = "";
	for (let i = text.length - 1; i >= 0; i--)
	{
		output += text[i];
	}
	return output;
}

function run (message, args)
{
	let embed = new Discord.MessageEmbed()
	.setTitle(`Reverse Text`)
	.addField("Original:", args.full)
	.addField("Reversed:", reverse(args.full) );

	return new Command.TextMessage(message, embed);
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