"use strict";

const fs = require("fs");
const Discord = require("discord.js");
const Tools = require("./botTools.js");
const CommandConst = require("./commandConst");

const prefix = 'fg.';

let commandList = [];

let addCommand = (path, filename, category) =>
{
	let commandObject = require(`${path}/${filename}`);

	let cmd = new CommandConst.Command
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

let isScript = (name) =>
{
	let suffix = ".js";
	return name.indexOf(suffix) == name.length - suffix.length;
};

let requirePath = "./../commands";
let readPath = "./files/commands"
let commandsDir = fs.readdirSync(readPath);
commandsDir.forEach( (commandsDirElement) =>
{
	if (isScript(commandsDirElement) )
	{
		addCommand(requirePath, commandsDirElement, "unlisted");
		console.log("Added Command:", commandsDirElement);
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
				if (isScript(e) && e != base)
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
			if (isScript(subDirElement) )
			{
				let path = `${requirePath}/${commandsDirElement}`;

				addCommand(path, subDirElement, "unlisted");
				console.log("Added Command:", subDirElement);
			}	
		});
	}
});

console.log(commandList);

module.exports =
{
	commandList: commandList,
	prefix: prefix
};