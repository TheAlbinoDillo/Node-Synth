"use strict";

const Discord = require("discord.js");
const Tools = require("./../../scripts/botTools.js");

async function run (message, args)
{
	if (args[0] == "add") {
		let text = args.join(" ");
		Tools.settings.write(message.guild, "foods", [text], true);
		return `Added \`${text}\` to the food list.`;
	}

	if (args[0] == "search") {
		let foodlist = Tools.settings.read(message.guild, "foods");
		let matches = [];

		for (let i = 0, l = foodlist.length; i < l; i++) {
			if (foodlist[i].includes(args[1]) ) {
				matches.push({text: foodlist[i], index: i});
			}
		}

		if (matches.length == 0) {
			return `No matches for \`${args[1]}\``;
		}

		let text = "Search results:\n";
		for (let i = 0, l = matches.length; i < l; i++) {
			text += `${matches[i].index}: \`${matches[i].text}\`\n`;
		}

		return text;
	}

	if (args[0] == "remove") {
		if (parseInt(args[1]) == NaN) {
			return "Not a valid selection.";
		} else {
			let foodlist = Tools.settings.read(message.guild, "foods");
			let removed = foodlist.splice(parseInt(args[1]), 1);
			Tools.settings.write(message.guild, "foods", foodlist);
			return `Removed \`${removed}\` from the food list.`;
		}
	}

	if (args[0] == "rmlast") {
		let foodlist = Tools.settings.read(message.guild, "foods");
		let removed = foodlist.pop();
		Tools.settings.write(message.guild, "foods", foodlist);
		return `Removed \`${removed}\` from the food list.`;
	}
}

module.exports =
{
	name: "Foods",
	description: "Modify the food list.",
	calls:
	[
		"food",
		"foods"
	],
	runFunction: run,
	permissions: ["MANAGE_CHANNELS"]
};