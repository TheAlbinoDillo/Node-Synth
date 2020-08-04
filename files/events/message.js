"use strict";

const index = require("./../../index.js");
const commands = require("./../scripts/commands.js");

function run (message)
{
	if (!message.guild) return;

	if (message.content.toLowerCase().indexOf(commands.prefix) == 0) {
		
		if (message.author.bot) {
			console.log(`Bot (${message.author.username}) tried using a command:\n${message.content}\n`);
		} else {
			index.runCommand(message);
		}
	}	
}

module.exports =
{
	runFunction: run
};