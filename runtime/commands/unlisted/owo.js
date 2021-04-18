"use strict";

module.exports =
{
	name: "OwO",
	calls: ["owo"],
	perms: [],
	run: async (options) =>
	{
		BotActions.send(options, "OwO");
		
			let myMember = options.guild.members.cache.get(VarClient.user.id);
		let hasPerm = myMember.permissions.has("MANAGE_MESSAGES");
		if (hasPerm)
			options.message.delete().catch();
		// todo: BotTools delete message function
	}
}