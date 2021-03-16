"use strict";

async function run (options)
{
	let embed =
	{
		"title": ":link: Invite me to your server! :link:",
		"color": 3169024,
		"url": "https://discord.com/oauth2/authorize?client_id=662825806967472128&scope=bot&permissions=8"
	};

	BotActions.send(options, {embed: embed});
}

module.exports =
{
	name: "Invite",
	calls:
	[
		"invite",
		"link"
	],
	run: run,
	perms: []
};