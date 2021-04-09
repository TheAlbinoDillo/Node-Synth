"use strict";

global.VarClient = {};
global.VarEventList = {};
global.VarCommandList = {};
global.VarCommandCalls = {};

const fs = require("fs.promises");
const discord = require("discord.js");
const rl = require("readline");
require("dotenv").config();

const BotConnect = require("./scripts/BotConnect.js");

const client = new discord.Client();
global.Client = client;

BotConnect(client, process.env.BOT_TOKEN);

client.on("ready", () =>
{
	setupEvents().then( () =>
	{
		/*client.user.setActivity('Under Construction!', { type: '' })
		.then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
		.catch(console.error);*/

		console.log("Ready.");
	});
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

	fs.writeFile("error_log.txt", message);
	process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) =>
{
	console.error(reason.stack);
	
	fs.writeFile("error_log.txt", reason.stack);
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

async function setupEvents ()
{
	await loadScripts();
	await loadEvents();
	await loadCommands();

	for (let event in VarEventList)
	{
		Client.on(event, (arg1, arg2) =>
		{
			VarEventList[event].run(arg1, arg2).then().catch( (error) =>
			{
				console.error(event, error);
			});
		});
	}
}

async function filterPath (path)
{
	// Regular Expression that only accepts javascript files
	let fileReg = /^.+\.js$/g;

	// Read directory and filter out only .js files
	let contents = await fs.readdir(path);
	let scripts = contents.filter( (c) =>
	{
		// Reset RegEx and test
		fileReg.lastIndex = 0;
		return fileReg.test(c);
	});
	return scripts;
}

async function loadScripts ()
{
	console.log("Loading global scripts...");

	// File path to global scripts
	let path = "./scripts";

	// Load each script and add it to global
	let scripts = await filterPath(path);
	scripts.forEach( (e, i) =>
	{
		let scriptName = e.replace(/\.js/, "");
		global[scriptName] = require(`${path}/${e}`);
		console.log(`  Loaded ${e}`);
	});

	console.log("Loaded global scripts.\n");
}

async function loadEvents ()
{
	console.log("Loading events...");

	// File path to event scripts
	let path = "./runtime/events";

	// Load each script and add it to the event list
	let scripts = await filterPath(path);
	scripts.forEach( (e, i) =>
	{
		let eventName = e.replace(/\.js/, "");
		VarEventList[eventName] = require(`${path}/${e}`);
		console.log(`  Loaded ${e}`);
	});

	console.log("Loaded events.\n");
}

async function loadCommands ()
{
	console.log("Loading commands...");

	// File path to command scripts
	let path = "./runtime/commands";

	// Read directory and loop for every folder
	let contents = await fs.readdir(path);

	for (let i = 0, l = contents.length; i < l; i++)
	{
		let folder = contents[i];
		console.log(`  Loading ${folder}...`);

		// If folder contains a master command
		let scripts = await filterPath(`${path}/${folder}`);
		if (scripts.includes(`_${folder}.js`) )
		{
			let commandArray = require(`${path}/${folder}/_${folder}.js`);
			loadMultipleCommand(commandArray);
			continue;
		}

		// If folder contains single commands
		scripts.forEach( (script) =>
		{
			let command = require(`${path}/${folder}/${script}`);
			loadSingleCommand(command, script);
		});
	}

	console.log("Loaded commands.\n");
}

async function loadSingleCommand (command, file)
{
	// Fail if command has no name
	if (!command.name)
	{
		console.error(`    Command from ${file} failed without name.`);
		return;
	}

	// Add command call if not specified
	if (!command.calls)
	{
		command.calls = [command.name.toLowerCase().replace(/\s/g, "")];
		console.warn(`    Forced call of ${command.name} to ${command.calls[0]}.`);
	}

	// Add command to VarCommandList
	VarCommandList[command.name] = command;

	// Add calls to VarCommandCalls
	command.calls.forEach( (call) =>
	{
		VarCommandCalls[call] = command.name;
	});

	console.log(`    Loaded ${command.name}.`);
}

async function loadMultipleCommand (array)
{
	array.forEach( (command) =>
	{
		loadSingleCommand(command);
	});
}
