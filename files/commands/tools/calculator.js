"use strict";

const Discord = require("discord.js");
const Command = require("./../../scripts/commandConst.js");
const MathJS = require("mathjs");

function run (message, args)
{
	let embed = new Discord.MessageEmbed()
	.setTitle(`Calculator`)
	.setThumbnail("https://i.imgur.com/lUBOk8j.png");

	try
	{
		let answer = MathJS.evaluate(args.full);
		embed.addField(`${args.full} =`, `${answer}`);
	}
	catch (error)
	{
		embed.addField("Error:", error.message);
	}

	return new Command.TextMessage(message, embed);
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