"use strict";

async function run (message, args)
{
	let link = "https://discord.com/oauth2/authorize?client_id=662825806967472128&scope=bot&permissions=8";
	return link;
}

module.exports =
{
	name: "Invite",
	description: "Get an ivite link for the bot!",
	calls:
	[
		"invite"
	],
	runFunction: run
};