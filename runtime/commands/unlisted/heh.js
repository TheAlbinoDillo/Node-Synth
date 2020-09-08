"use strict";

const actions = root_require("actions.js");

module.exports =
{
	name: "OwO",
calls: ["owo","OwO"],
	perms: [],
	run: async (options) =>
	{
		actions.send(options, "OwO");
options.message.delete().catch();
                
	}
}
