"use strict";

// Make empty global objects
["Client", "EventList", "CommandList", "CommandCalls", "CommandCategories"]
.forEach( (e, i) =>
{
	global[`Var${e}`] = {};
});

// Import
const fs = require("fs.promises");
const discord = require("discord.js");
require("dotenv").config();

// Create Discord client
VarClient = new discord.Client();
VarClient.on("ready", () =>
{
	init();
});

// Connect to Discord
const BotConnect = require("./scripts/BotConnect.js");
BotConnect(VarClient, process.env.BOT_TOKEN);


// Load all the external scripts
async function init ()
{
	await loadGlobalScripts();
	await loadEventScripts();
	await loadCommandScripts();

	// Handle events as they are called
	for (let event in VarEventList)
	{
		VarClient.on(event, (arg1, arg2) =>
		{
			VarEventList[event].run(arg1, arg2).then().catch( (error) =>
			{
				console.error(event, error);
			});
		});
	}
	console.log("Ready.");
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

async function loadGlobalScripts ()
{
	console.log("Loading global scripts...");

	// File path to global scripts
	let path = "./scripts";

	// Load each script and add it to global
	let scripts = await filterPath(path);
	scripts.forEach( (e, i) =>
	{
		let scriptName = e.replace(/\.js/, "");

		// Load script and add to globals if it has an export
		let script = require(`${path}/${e}`);
		if (script !== null)
			global[scriptName] = script;

		console.log(`  Loaded ${e}`);
	});

	console.log("Loaded global scripts.\n");
}

async function loadEventScripts ()
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

async function loadCommandScripts ()
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
			let scriptPath = `${path}/${folder}/_${folder}.js`
			let commandArray = require(scriptPath).forEach( (command) =>
			{
				loadCommand(command);
			});
			continue;
		}

		// If folder contains single commands
		scripts.forEach( (script) =>
		{
			let command = require(`${path}/${folder}/${script}`);

			// If command doesn't have a category
			// Give it a category based on folder name
			if (!command.category)
				command.category = folder;

			loadCommand(command, script);
		});
	}

	console.log("Loaded commands.\n");
}

async function loadCommand (command, file)
{
	// Abort if command has no name
	if (!command.name)
	{
		console.error(`Command from ${file} failed without name.`);
		process.exit(2);
	}

	// Abort if command is not async
	if (command.run[Symbol.toStringTag] !== "AsyncFunction")
	{
		console.error(`Command from ${file} has non-async function.`);
		process.exit(3);
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

	// Create category if it doesn't exist yet
	if (!VarCommandCategories[command.category])
		VarCommandCategories[command.category] = [];

	// Add category to VarCommandCategories
	VarCommandCategories[command.category].push(command.name);

	console.log(`    Loaded ${command.name}.`);
}
