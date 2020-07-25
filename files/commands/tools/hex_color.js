"use strict";

const Discord = require("discord.js");
const Command = require("./../../scripts/commandConst.js");
const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	if (args[0] == "FUCKME") {
		return "OwO";
	}

	if (args[0] == null) {
		return `Specify a hex code.`;
	}

	if (args[0].replace(/[^a-f0-9]/gi,'').length != 6) {
		return `**${args[0]}** is not a valid hex code.`;
	}	

	let colorName = Tools.colors.closest(args[0]);
	let colorCode = Tools.colors.format(args[0]).substring(1);
	let url = `https://via.placeholder.com/50/${colorCode}/${colorCode}.png`;

	let embed = new Discord.MessageEmbed()
	.setThumbnail(url)
	.addField("#" + colorCode, colorName);

	return new Command.TextMessage(message, embed);
}

module.exports =
{
	name: "Hex Color",
	description: "Get a preview of a hex color!",
	calls:
	[
		"hex",
		"color",
		"hexcolor"
	],
	runFunction: run,
	usage: ["hex value"]
};