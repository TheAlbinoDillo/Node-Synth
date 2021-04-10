"use strict";

async function run (channel)
{
	let options =
	{
		channel: channel
	};

	let message =
	"Just a heads up that I can read this channel, if you don't want that, make sure " +
	"to turn off my ability to read messages in this channel's permission settings."

	BotTools.send(options, message, true);
}

module.exports =
{
	run: run
};