"use strict";

this.run = (options) =>
{
	console.log("Loading commands...");

	let client = options.client;
	client.commands = [];

	let categories = options.tools.list_dir(options.current_path_up);
	categories.folders.forEach( (category) =>
	{
		client.commands.push(category.filename);
	});
	console.log(client.commands)
};