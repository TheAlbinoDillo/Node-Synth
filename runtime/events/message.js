"use strict";

const command_test = /(?<prefix>^fg(?:\. |[^a-z0-9?]))(?<command>[^\s]+) ?(?<options>.+)*/gi;
const options_test = /\w+|(?:"[^"]*"|`[^`]*`|'[^']*')/g;

this.run = async (message) =>
{
	//Breakout message object properties
	let content = message.content;
	let guild = message.guild;
	let author = message.author;

	//Fail if message has no guild
	//This usually means it's a DM message
	if (!guild) return;

	//Fail if the prefix is being ran by a bot
	if (author.bot) return;

	//Run the command_test RegEx to get compenents of a
	//command (if there are any to get)
	let command_msg = command_test.exec(content);

	//Fail if no command structured matches were found
	if (!command_msg) return;

	//Breakout command_msg object properties
	let groups = command_msg.groups;

	//Breakout groups object properties
	let prefix = groups.prefix;
	let command = groups.command;
	let options = groups.options;

	//If there are options with the command
	//replace them with a structured array
	if (options)
	{
		let matches = options.match(options_test);
		options = matches;
	}

	

	//to-do

	//Make a system to find commands effciently
	//Maybe a CommandList class with search options

        //Make the events script handle promises
};
