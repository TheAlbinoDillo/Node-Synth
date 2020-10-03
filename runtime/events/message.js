"use strict";

const actions = script_require("actions.js");
const index = root_require("index.js");

//RegEx to test for the prefix call and command
const command_test = /(?<prefix>^fg(?:\. |[^a-z0-9?]))(?<call>[^\s<]+) ?(?<options>.+)*/gi;

//RegEx to seperate the options out
const options_test = /[^\s]+|(?:"[^"]*"|`[^`]*`|'[^']*')/g;

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
	let call = groups.call.toLowerCase();
	let cmd_options = groups.options;
	let cmd_args;

	//If there are options with the command
	//replace them with a structured array
	if (cmd_options)
	{
		let matches = cmd_options.match(options_test);
		cmd_args = matches;
	}

	//Search for command
	let selected_command = command_list.find(call);

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
		//Test if the user is this bot's owner
		if (member.id !== index.client_settings.owner)
		{
			//Fail if the user is not the bot's owner
			let say = `Only the bot owner can use \`${selected_command.name}\`.`;
			actions.react_say(message, "⛔", say);
			return;
		}
	}
	
	if (!member.permissions.has(selected_command.perms) && member.id !== index.client_settings.owner)
	{
		//Fail if the user doesn't have the needed permissions
		let say = `${member} does not have permission to use \`${selected_command.name}\`.`;
		actions.react_say(message, "⛔", say);
		return;
	}

	//Create an options object to send to the command
	let options =
	{
		message: message,
		guild: guild,
		channel: message.channel,
		member: member,
		author: author,
		args: cmd_args,
		full: cmd_options,
		client: message.client
	};

	//Try to run command
	selected_command.run(options).catch( (error) =>
	{
		let say = `\`${selected_command.name}\`\n${error.stack}`;
		actions.react_say(message, "⁉️", say);
		return;
	});

	//Delete message used to run command
};
