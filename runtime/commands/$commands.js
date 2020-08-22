"use strict";

const tools = root_require("tools.js");
const commands = root_require("commands.js");

this.run = (options) =>
{
	console.log("Loading commands...\n");

	let categories = tools.list_dir(options.current_path_up);
	categories.folders.forEach( (category) =>
	{
		console.log(`\tLoading ${category.filename}...\n`);

		let commands_subdir = tools.list_dir(category.path);
		let filtered = commands_subdir.files.filter( (file) =>
		{
			return file.filename.endsWith(options.runtime_settings.extension);
		});

		filtered.forEach( (command) =>
		{
			let path = `./${category.filename}/${command.filename}`;
			
			if (options.runtime_settings.test_name(command.filename) )
			{
				require(path).run(options, category.path);
			}
			else
			{
				let new_command = require(path);
				new_command.category = category.filename;

				new commands.Command(new_command);
			}
		});
	});
};