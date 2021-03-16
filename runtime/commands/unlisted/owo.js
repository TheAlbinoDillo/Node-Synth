"use strict";

module.exports =
{
	name: "OwO",
	calls: ["owo"],
	perms: [],
	run: async (options) =>
	{
		BotActions.send(options, "OwO");
		options.message.delete().catch();
	}
}