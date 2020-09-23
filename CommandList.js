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