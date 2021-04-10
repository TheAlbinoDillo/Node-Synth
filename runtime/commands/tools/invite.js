"use strict";

const baseurl = "https://discord.com/oauth2/authorize";
const perms = 67497024;

/*const query =
{
	client_id: VarClient.user.id,
	scope: "bot",
	permissions: 67497024
};*/

async function run (options)
{
	let embed =
	{
		"title": ":link: Invite me to your server! :link:",
		"color": 3169024,
		"url": `${baseurl}?client_id=${VarClient.user.id}&scope=bot&permissions=${perms}`
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