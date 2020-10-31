
"use strict";

const actions = script_require("actions.js");

module.exports =
{
	name: "Huh?",
calls: ["huh"],
	perms: [],
	run: async (options) =>
	{
		actions.send(options, "huh");    
	}
}
