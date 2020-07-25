"use strict";

const Command = require("./../../scripts/commandConst.js");
const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	let rolls = args[0] || 2;

	let text = "Rolls: ", total = 0, succ = 0;
	for (let i = 0; i < rolls; i++) {
		let pick = Tools.randNumber(1, 6);
		text += `${pick}${i != rolls - 1 ? ", " : ""}`;
		total += pick;
		succ += pick >= 4 ? 1 : 0;
	}
	text =  `${text}\nTotal: ${total}\nSuccesses: ${succ}`;

	return [new Command.TextMessage(message, text), new Command.ReactEmote(message, "🎲")];	
}

module.exports =
{
	name: "Roll",
	description: "Roll a number of dice!",
	calls:
	[
		"roll",
		"rolls",
		"dice"
	],
	runFunction: run,
	usage: ["rolls"]
};