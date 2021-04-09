"use strict";

const index = require("../../index.js");

// Test if user's id is the bot's owner
function isOwner (user)
{
	return user.id == process.env.CLIENT_OWNER;
}

async function run (message)
{
	processMessage(message).catch( (error) =>
	{
		let say = `Something went wrong!\n${error.stack}`;
		BotActions.react_say(message, "‼️", say);	
		console.error(say);
	});
}

async function processMessage (message)
{
	// Breakout message object properties
	let content = message.content;
	let guild = message.guild;
	let author = message.author;
	let member = message.member;

	// Fail if message has no guild
	// This usually means it's a DM message
	if (!guild) return;

	// Fail if the prefix is being ran by a bot
	if (author.bot) return;

	// Parse string for command
	let parsed = BotTools.parseCommand(content);

	// Fail if this message doesn't look like a command
	if (!parsed)
		return;

	// Search for command
	let selectedCommand = VarCommandList[VarCommandCalls[parsed.call] ];

	// Fail if this command doesn't exist
	if (!selectedCommand)
	{
		let say = `\`${parsed.call}\` is not a command.`;
		BotActions.react_say(message, "❓", say);	
		return;
	}

	// Test if this command is NSFW
	if (selectedCommand.nsfw && !message.channel.nsfw)
	{
		let msg = `\`${selectedCommand.name}\` is only allowed in NSFW channels.`;
		BotActions.react_say(message, "🔞", msg);
		return;
	}

	// Test if user has permission to use this command
	if (selectedCommand.perms.includes("BOT_OWNER") )
	{
		// Test if the user is this bot's owner
		if (!isOwner(member) )
		{
			// Fail if the user is not the bot's owner
			let say = `Only the bot owner can use \`${selectedCommand.name}\`.`;
			BotActions.react_say(message, "⛔", say);
			return;
		}
	}
	else if (!member.permissions.has(selectedCommand.perms) && !isOwner(member) )
	{
		// Fail if the user doesn't have the needed permissions
		let say = `${member} does not have permission to use \`${selectedCommand.name}\`.`;
		BotActions.react_say(message, "⛔", say);
		return;
	}

	// Create an options object to send to the command
	let options =
	{
		message: message,
		guild: guild,
		channel: message.channel,
		member: member,
		author: author,
		args: parsed.cmdArgs,
		full: parsed.cmdOptions,
		client: message.client
	};

	// Try to run command
	selectedCommand.run(options).catch( (error) =>
	{
		let say = `\`${selectedCommand.name}\`\n${error.stack}`;
		BotActions.react_say(message, "⁉️", say);
		console.error(say);
		return;
	});
};

module.exports =
{
	run: run
};