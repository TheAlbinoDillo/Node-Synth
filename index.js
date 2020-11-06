"use strict";

//Global variables
//////////////////////////////////////////////////////////////////////////////////

//Fix for relative require
global.root_require = (filename) =>
{
	return require(__dirname + '/' + filename);
};

global.script_require = (filename) =>
{
	return require(__dirname + '/scripts/' + filename);
};

//Import libraries
//////////////////////////////////////////////////////////////////////////////////
const fs = require("fs");
const discord = require("discord.js");
const rl = require("readline");
require("dotenv").config();

const tools = script_require("tools.js");
const connect = script_require("connect.js");
const CommandList = script_require("CommandList.js");

global.command_list = new CommandList();

//Client variables
//////////////////////////////////////////////////////////////////////////////////
const client = new discord.Client();

const runtime_settings =
{
	path: "./runtime",
	prefix: "$",
	extension: ".js",
	test_name (filename)
	{
		let starts = filename.startsWith(this.prefix);
		let ends = filename.endsWith(this.extension);
		return starts && ends;
	},
	remove_extension (filename)
	{
		let minus = this.extension.length;
		return filename.substring(0, filename.length - minus);
	}
};

//////////////////////////////////////////////////////////////////////////////////
const setup_runtime = (setup_settings = runtime_settings) =>
{
	let runtime_dirs = tools.list_dir(setup_settings.path);

	runtime_dirs.folders.sort( (a, b) =>
	{
		if (a.filename === "eval")
		{
			return -1;
		}
		return 1;
	});

	runtime_dirs.folders.forEach( (element) =>
	{
		let runtime_subdirs = tools.list_dir(element.path);
		runtime_subdirs.files.forEach( (subelement) =>
		{
			if (runtime_settings.test_name(subelement.filename) )
			{
				let options =
				{
					runtime_settings: runtime_settings,
					client: client,
					current_path_up: element.path
				};

				require(subelement.path).run(options);
			}
		});
	});
};

connect(client, process.env.BOT_TOKEN);

client.on("ready", () =>
{
	setup_runtime();

	console.log("Ready.");
});

module.exports =
{
	client: client
};

//Exception and Promise Rejection logging
//////////////////////////////////////////////////////////////////////////////////
process.on('uncaughtException', async (error) =>
{
	let message = Date.now() + "\n" + error.stack;
	console.error(error);

	fs.writeFileSync("error_log.txt", message);
	process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) =>
{
	console.error(reason.stack);
	
	fs.writeFileSync("error_log.txt", reason.stack);
	process.exit(1);
});

const rl_interface = rl.createInterface
({
	input: process.stdin,
	output: process.stdout
	
}).on('line', (input) =>
{
	let output;
	try
	{
		output = eval(input);
	}
	catch (error)
	{
		output = error;
	}
	console.log(output);
});