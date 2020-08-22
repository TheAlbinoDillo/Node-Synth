"use strict";

const actions = root_require("actions.js");
const commands = root_require("commands.js");

async function run (options)
{
	let categories = commands.command_list.get_categories();

	console.log(categories)
	return;

	let embed =
	{
		title: `Help for ${options.client.user.username}`,
		thumbnail:
		{
			url: "https://i.imgur.com/zfVwbiK.png"
		},
		fields: []
	};



	actions.send(options, "help");
}

module.exports =
{
	name: "Help",
	calls: ["help"],
	perms: [],
	run: run
}