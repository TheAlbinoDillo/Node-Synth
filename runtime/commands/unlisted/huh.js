
"use strict";

module.exports =
{
	name: "Huh?",
	calls: ["huh"],
	perms: [],
	run: async (options) =>
	{
		BotActions.send(options, "huh");    
	}
}
