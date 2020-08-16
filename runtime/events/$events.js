"use strict";

const tools = root_require("tools.js");

this.run = (options) =>
{
	console.log("Loading events...\n");

	let event_scripts = tools.list_dir(options.current_path_up);
	event_scripts.files.filter( (file) =>
	{
		return !options.runtime_settings.test_name(file.filename);

	}).forEach( (file) =>
	{
		let runFunction = require(`./${file.filename}`).run;
		let name = options.runtime_settings.remove_extension(file.filename);

		options.client.on(name, runFunction);
		console.log(`\tLoaded ${name}\n`);
	});
};