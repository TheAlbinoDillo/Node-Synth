"use strict";

const index = require("./../../index.js");
//const commands = require("./../scripts/commands.js");

this.run = (message) =>
{
	if (!message.guild) return;

	if (message.author.bot) return;

	let lowercont = message.content.toLowerCase();
	let prefix = commands.prefix;

	if (lowercont.indexOf(prefix) ) return;

	if (!lowercont[prefix.length].replace(/[0-9a-z]/gi, "") ) return;

	index.runCommand(message);
};