"use strict";

const actions = root_require("actions.js");

module.exports =
{
	name: "heh",
	perms: ["MANAGE_MESSAGES"],
	run: async (options) =>
	{
		actions.send(options, "heh");
	}
}