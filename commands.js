"use strict";

class Command
{
	constructor (options)
	{
		this.name = options.name || `Command ${Date.now()}`;
		this.desc = options.desc || `Run ${this.name}!`;

		let run_function = async () => {return this.name + "!"};
		this.run = options.run || run_function;

		let call_name = this.name.toLowerCase().replace(/\s/g, "");
		this.calls = options.calls || [call_name];

		this.perms = options.perms || ["BOT_OWNER"];

		this.category = options.category;

		command_list.add(this);

		console.log(`\t\tLoaded ${this.name}\tfg ${this.calls}`);
		console.log(`\t\t${this.desc}\n`);
	}
}

class CommandList
{
	constructor ()
	{
		this.call_list = {};
		this.commands_list = {};
		this.category_list = {};
	}

	add (command)
	{
		let calls = command.calls;
		this.commands_list[calls[0] ] = command;

		for (let i = 0, l = calls.length; i < l; i++)
		{
			this.call_list[calls[i] ] = calls[0];
		}

		if (this.category_list[command.category] === undefined)
		{
			this.category_list[command.category] = {};
		}
		this.category_list[command.category][calls[0] ] = command;
	}

	find (call)
	{
		let selected = this.call_list[call];
		if (!selected) return;

		return this.commands_list[selected];
	}

	get_categories ()
	{
		return this.category_list;
	}
}

var command_list = new CommandList();

module.exports =
{
	Command: Command,
	CommandList: CommandList,
	command_list: command_list
};