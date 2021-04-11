"use strict";

const searchLimit = 20;
const repeatCalls = ["repeat", "!!"];

// RegEx to identify repeated commands
const repeatReg = /\u200b<@(?<id>\d+)> `(?<command>.+)`/g;

async function run (options)
{
	// Get last 50 messages in the channel
	let messages = await options.channel.messages.fetch({limit: searchLimit});
	messages = messages.array();
	
	// Remove the message that ran this command
	messages = messages.filter( (m) =>
	{
		return m.id !== options.message.id;
	});

	// Filter out only messages from author
	// or from this bot (for repeats)
	messages = messages.filter( (m) =>
	{
		let isAuthor = m.author.id === options.author.id;
		let isThisBot = m.author.id === VarClient.user.id;
		return isAuthor || isThisBot;
	});

	// Fail if no messages in last 50
	if (messages.length === 0)
		return none(options);

	// Filter out only command messages
	// Including those from repeat commands
	// And remove commands that look like fg repeat
	messages = messages.filter( (m) =>
	{
		repeatReg.lastIndex = 0;

		let parsed = BotTools.parseCommand(m.content);
		let repeat = repeatReg.exec(m.content);

		if (!parsed && !repeat)
			return false;

		// Alter the bot's repeat message to look like
		// the user actually ran that command
		if (repeat)
		{
			let user = VarClient.users.cache.get(repeat.groups.id);
			let command = repeat.groups.command;
			m.author = user;
			m.content = command;

			return true;
		}

		// Remove Repeat commands to prevent looping
		if (repeatCalls.includes(parsed.call) )
			return false;

		return true;
	});

	// Fail if no messages in last 50
	if (messages.length === 0)
		return none(options);

	// Sort messages by inverse time
	messages = messages.sort( (a, b) =>
	{
		return b.createdTimestamp - a.createdTimestamp;
	});

	// Inject the old command into the current message object
	options.message.content = `${messages[0].content} ${options.full || ""}`.trim();

	BotActions.send(options, `\u200b${options.author} \`${options.message.content}\``);

	// Run old command as if a new message
	VarEventList.message.run(options.message).catch( (error) =>
	{
		console.error(event, error);
	});
}

function none (options)
{
	BotActions.send(options, `I didn't find any of your commands in the last ${searchLimit} messages.`);
}

module.exports =
{
	name: "Repeat",
	run: run,
	perms: [],
	calls: repeatCalls
};