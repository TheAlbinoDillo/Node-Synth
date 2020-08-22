"use strict";

const Tools = root_require("tools.js");
const Commands = root_require("commands.js");

this.run = (options) =>
{
	console.log("Loading commands...\n");

	let categories = Tools.list_dir(options.current_path_up);
	categories.folders.forEach( (category) =>
	{
		console.log(`\tLoading ${category.filename}...\n`);

		let Commands_subdir = Tools.list_dir(category.path);
		let filtered = Commands_subdir.files.filter( (file) =>
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

				new Commands.Command(new_command);
			}
		});
	});
};