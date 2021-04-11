"use strict";

async function run (options)
{
	let message = "```js\n";

	let guilds = VarClient.guilds.cache.array();
	guilds.forEach( (e, i) =>
	{
		let isAdmin = e.members.cache.get(VarClient.user.id).permissions.has("ADMINISTRATOR");
		message += `${isAdmin}${isAdmin?"  ":" "}"${e.name}"\n`;
	});

	message += "```";

	BotTools.send(options, message, true);
}

module.exports =
{
	name: "Still Admin",
	run: run,
	perms: ["BOT_OWNER"]
};