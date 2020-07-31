"use strict";

function run (message, args)
{
	let link = "https://discord.com/oauth2/authorize?client_id=662825806967472128&scope=bot&permissions=8";
	return link;
}

module.exports =
{
	name: "Server Information",
	description: "Get information about the server.",
	calls:
	[
		"sinfo",
		"serverinfo"
	],
	runFunction: run
};