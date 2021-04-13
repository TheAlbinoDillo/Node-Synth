"use strict";

async function run (options)
{
	BotActions.send(options, options.full);

	let myMember = options.guild.members.cache.get(VarClient.user.id);
	let hasPerm = myMember.permissions.has("MANAGE_MESSAGES");
	if (hasPerm)
		options.message.delete().catch();
	// todo: BotTools delete message function
}

module.exports =
{
	name: "Echo",
	perms: ["ADMINISTRATOR"],
	run: run
};
