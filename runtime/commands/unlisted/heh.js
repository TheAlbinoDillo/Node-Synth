"use strict";

const actions = script_require("actions.js");

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
