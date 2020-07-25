"use strict";

const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	let arr = Tools.arrayIntoList(Tools.getMentionList(message, true) ) || "themselves";

	let foodlist = Tools.settings.read(message.guild, "foods");

	if (foodlist == null) {
		return "The food list is empty.";
	}

	let matches = [];
	if (args[0]) {
		for (let i = 0, l = foodlist.length; i < l; i++) {
			if (foodlist[i].includes(args[0]) ) {
				matches.push(foodlist[i]);
			}
		}
	}

	let text = `${Tools.serverName(message.author, message.guild)} feeds ${arr} ${matches.length > 0 ? Tools.randArray(matches) : Tools.randArray(foodlist)}`;
	return text;	
}

module.exports =
{
	name: "Feed",
	description: "Give someone a nice snack!",
	calls:
	[
		"feed",
		"feeds"
	],
	runFunction: run
};