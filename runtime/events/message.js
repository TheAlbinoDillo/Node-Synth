"use strict";

const commands = root_require("commands.js");
const actions = root_require("actions.js");
const index = root_require("index.js");

const command_test = /(?<prefix>^fg(?:\. |[^a-z0-9?]))(?<call>[^\s]+) ?(?<options>.+)*/gi;
const options_test = /\w+|(?:"[^"]*"|`[^`]*`|'[^']*')/g;

this.run = (message) =>
{
	//Breakout message object properties
	let content = message.content;
	let guild = message.guild;
	let author = message.author;
	let member = message.member;

	//Fail if message has no guild
	//This usually means it's a DM message
	if (!guild) return;

	//Fail if the prefix is being ran by a bot
	if (author.bot) return;

	//reset command_test RegEx pointer
	command_test.lastIndex = 0;
	//Run the command_test RegEx to get compenents of a
	//command (if there are any to get)
	let command_msg = command_test.exec(content);

	//Fail if no command structured matches were found
	if (!command_msg) return;

	//Breakout command_msg object properties
	let groups = command_msg.groups;

	//Breakout groups object properties
	let prefix = groups.prefix;
	let call = groups.call;
	let options = groups.options;

	//If there are options with the command
	//replace them with a structured array
	if (options)
	{
		let matches = options.match(options_test);
		options = matches;
	}

	//Search for command
	let selected_command = commands.command_list.find(call);

	//Fail if this command doesn't exist
	if (!selected_command)
	{
		let say = `\`${call}\` is not a command.`;
		actions.react_say(message, "❓", say);	
		return;
	}

	//Test if user has permission to use this command
	if (selected_command.perms.includes("BOT_OWNER") )
	{
		if (member.id !== index.client_settings.owner)
		{
			let say = `Only the bot owner can use \`${selected_command.name}\`.`;
			actions.react_say(message, "⛔", say);
			return;
		}
	}
	else if (!member.permissions.has(selected_command.perms) )
	{
		let say = `${member} does not have permission to use \`${selected_command.name}\`.`;
		actions.react_say(message, "⛔", say);
		return;
	}

	//Try to run command
	selected_command.run(
	{
		message: message,
		guild: message.guild,
		channel: message.channel

	}).catch( (error) =>
	{
		let say = `\`${selected_command.name}\`\n${error.message}`;
		actions.react_say(message, "⁉️", say);
	});
};