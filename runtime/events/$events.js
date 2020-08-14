"use strict";

const run = (options) =>
{
	console.log("Loading events...");

	let event_scripts = options.tools.list_dir(options.current_path_up);
	event_scripts.files.filter( (file) =>
	{
		return file.filename[0] != options.runtime_settings.prefix;

	}).forEach( (file) =>
	{
		let minus = options.runtime_settings.extension.length;

		let name = file.filename;
		let runFunction = require(`./${name}`).run;

		name = name.substring(0, name.length - minus);

		options.client.on(name, runFunction);

		console.log(`  Loaded ${name}`);
	});
};

module.exports =
{
	run: run
};