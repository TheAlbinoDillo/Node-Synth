"use strict";

const Actions = script_require("actions.js");
const index = root_require("index.js");

//RegEx to test for the prefix call and command
const command_test = /(?<prefix>^fg(?:\. |[^a-z0-9?]))(?<call>[^\s<]+) ?(?<options>.+)*/gi;

//RegEx to seperate the options out
const options_test = /[^\s]+|(?:"[^"]*"|`[^`]*`|'[^']*')/g;

//Test if user's id is the bot's owner
function isOwner (user)
{
	return user.id == index.client_settings.owner;
}

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
	let selectedCommand = command_list.find(call);

	//Fail if this command doesn't exist
	if (!selectedCommand)
	{
		let say = `\`${call}\` is not a command.`;
		Actions.react_say(message, "❓", say);	
		return;
	}

	//console.log(selectedCommand);

	//Test if this command is NSFW
	if (selectedCommand.nsfw && !message.channel.nsfw)
	{
		let msg = `\`${selectedCommand.name}\` is only allowed in NSFW channels.`;
		Actions.react_say(message, "🔞", msg);
		return;
	}

	//Test if user has permission to use this command
	if (selectedCommand.perms.includes("BOT_OWNER") )
	{
		//Test if the user is this bot's owner
		if (!isOwner(member) )
		{
			//Fail if the user is not the bot's owner
			let say = `Only the bot owner can use \`${selectedCommand.name}\`.`;
			Actions.react_say(message, "⛔", say);
			return;
		}
	}
	else if (!member.permissions.has(selectedCommand.perms) && !isOwner(member) )
	{
		//Fail if the user doesn't have the needed permissions
		let say = `${member} does not have permission to use \`${selectedCommand.name}\`.`;
		Actions.react_say(message, "⛔", say);
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
	selectedCommand.run(options).catch( (error) =>
	{
		let say = `\`${selectedCommand.name}\`\n${error.stack}`;
		Actions.react_say(message, "⁉️", say);
		return;
	});
};
