"use strict";

const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	let users = message.mentions.users.array();

	if (users < 1) {
		return "Specify users to ban.";
	}

	for (let i = 0, l = users.length; i < l; i++)
	{
		let replace = users[i].toString().replace("<@", "<@!");
		replace = new RegExp(replace, "g");
		message.content = message.content.replace(replace, "").trim();
	}

	let members = message.guild.members.cache;
	for (let i = 0, l = users.length; i < l; i++)
	{
		let member = members.get(users[i].id);
		member.ban({reason: message.content});
	}
	return `Banned ${Tools.arrayIntoList(Tools.getMentionList(message, true) )}`;
}

module.exports =
{
	name: "Kick",
	description: "Kick a user.",
	calls:
	[
		"kick",
		"dropkick"
	],
	runFunction: run,
	permissions: ["KICK_MEMBERS"]
};