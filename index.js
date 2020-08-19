"use strict";

//Global variables
//////////////////////////////////////////////////////////////////////////////////

//Fix for relative require
global.root_require = (filename) =>
{
	return require(__dirname + '/' + filename);
}

//Import libraries
//////////////////////////////////////////////////////////////////////////////////
const fs = require("fs");
const discord = require("discord.js");
const rl = require("readline");

const tools = root_require("tools.js");
const connect = root_require("connect.js");

//Client variables
//////////////////////////////////////////////////////////////////////////////////
const client = new discord.Client();
const client_settings = tools.load_json("./client_settings.json");

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

var commands = {};
class Command
{
	constructor (options)
	{
		this.name = options.name || `Command ${commands.length + 1}`;
		this.desc = options.desc || `Run ${this.name}!`;

		let run_function = async () => {return this.name + "!"};
		this.run = options.run || run_function;

		let call_name = this.name.toLowerCase().replace(/\s/g, "");
		this.calls = options.calls || [call_name];

		this.perms = options.perms || ["BOT_OWNER"];

		commands[this.calls[0] ] = this;

		console.log(`\t\tLoaded ${this.name}\tfg ${this.calls}`);
		console.log(`\t\t${this.desc}\n`);
	}
}

//////////////////////////////////////////////////////////////////////////////////
const setup_runtime = (setup_settings = runtime_settings) =>
{
	let runtime_dirs = tools.list_dir(setup_settings.path);
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
					current_path_up: element.path,
					Command: Command
				};

				require(subelement.path).run(options);
			}
		});
	});
};

connect(client, client_settings.token);

client.on("ready", () =>
{
	setup_runtime();
});

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

module.exports =
{
	Command: Command
};

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