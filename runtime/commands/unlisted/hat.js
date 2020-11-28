"use strict";

const actions = script_require("actions.js");

module.exports =
{
	name: "Hat",
	calls: ["hat"],
	perms: [],
	run: async (options) =>
	{
		actions.send(options, `http://choohy.com:5000/${options.author.id}`);
	}
}