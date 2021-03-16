
"use strict";

module.exports =
{
	name: "Cheese.",
	calls: ["cheese"],
	perms: [],
	run: async (options) =>
	{
		BotActions.send(options, ":cheese:");    
	}
}
