"use strict";

//Import libraries
//////////////////////////////////////////////////////////////////////////////////
const fs = require("fs").promises;
const discord = require("discord.js");

const tools = require("./tools.js");

//Client variables
//////////////////////////////////////////////////////////////////////////////////
const client = new discord.Client();

const client_settings =
{
	token: "",
	owner_id: ""
};

const runtime_settings =
{
	path: "./runtime",
	prefix: "$",
	extension: ".js"
};

//////////////////////////////////////////////////////////////////////////////////
const setup_runtime = async (setup_settings) =>
{
	let runtime_dirs = tools.list_dir(setup_settings.path);
	runtime_dirs.folders.forEach( (element) =>
	{
		let runtime_subdirs = tools.list_dir(element.path);
		runtime_subdirs.files.forEach( (subelement) =>
		{
			let filename = subelement.filename;
			let starts = filename.startsWith(runtime_settings.prefix);
			let ends = filename.endsWith(runtime_settings.extension);
			if (starts && ends)
			{
				let options =
				{
					runtime_settings: runtime_settings,
					client: client,
					tools: tools,
					current_path_up: element.path
				};

				require(subelement.path).run(options);
			}
		});
	});
};
setup_runtime(runtime_settings);

//Exception and Promise Rejection logging
//////////////////////////////////////////////////////////////////////////////////
process.on('uncaughtException', async (error) =>
{
	let message = Date.now() + "\n" + error.stack;
	console.error(error);

	fs.writeFile("error_log.txt", message);
	process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) =>
{
	let message = `Unhandled Rejection at:\n\tPromise ${promise}\nReason:\n${reason.stack}`;
    console.error(message);

    fs.writeFile("error_log.txt", message);
    process.exit(1);
});