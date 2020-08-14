"use strict";

const fs = require("fs");
const Discord = require("discord.js");
const Tools = require("./botTools.js");

const prefix = "fg";
let commandList = [];

class Command
{
	constructor
	(
		name,
		runFunction = function () {},
		description = "",
		category,
		usage = [],
		deleteMessage = false,
		permissions = [],
		calls = []
	){
		this.name = name;
		this.runFunction = runFunction;
		this.description = description;
		this.category = category;
		this.usage = usage;
		this.deleteMessage = deleteMessage;
		this.permissions = permissions;
		this.calls = calls;
	}
}

module.exports =
{
	commandList: commandList,
	prefix: prefix,
	Command: Command
};

let addCommand = (path, filename, category) =>
{
	let commandObject = require(`${path}/${filename}`);

	let cmd = new Command
	(
		commandObject.name,
		commandObject.runFunction,
		commandObject.description,
		category,
		commandObject.usage,
		commandObject.deleteMessage,
		commandObject.permissions,
		commandObject.calls,
	);
	commandList.push(cmd);
};

let requirePath = "./../commands";
let readPath = "./files/commands"
let commandsDir = fs.readdirSync(readPath);
commandsDir.forEach( (commandsDirElement) =>
{
	if (commandsDirElement.endsWith(".js") )
	{
		addCommand(requirePath, commandsDirElement, "unlisted");
	}
	else
	{
		let subDir = fs.readdirSync(`${readPath}/${commandsDirElement}`);

		let base = "$BASE.js"
		if (subDir.includes(base) )
		{
			let path = `${requirePath}/${commandsDirElement}`;

			subDir.forEach( (e) =>
			{
				if (e.endsWith(".js") && e != base)
				{
					addCommand(path, e, commandsDirElement);
				}
			});

			let importedCommands = require(`${path}/${base}`);
			importedCommands.forEach( (e, i) =>
			{
				commandList.push(importedCommands[i]);
			});

			return;
		}

		subDir.forEach( (subDirElement) =>
		{
			if (subDirElement.endsWith(".js") )
			{
				let path = `${requirePath}/${commandsDirElement}`;

				addCommand(path, subDirElement, commandsDirElement);
			}	
		});
	}
});