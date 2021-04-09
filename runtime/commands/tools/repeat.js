"use strict";

const searchLimit = 20;
const repeatCalls = ["repeat", "!!"];

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
	messages = messages.filter( (m) =>
	{
		return m.author.id === options.author.id;
	});

	// Fail if no messages in last 50
	if (messages.length === 0)
		return none(options);

	// Filter out only command messages
	// And remove commands that look like fg repeat
	messages = messages.filter( (m) =>
	{
		let parsed = BotTools.parseCommand(m.content);

		if (!parsed)
			return false;

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

	BotActions.send(options, `\`${options.message.content}\``);

	// Run old command as if a new message
	VarEventList.message.run(options.message).then().catch( (error) =>
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