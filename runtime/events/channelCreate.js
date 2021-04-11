"use strict";

async function run (channel)
{
	let options =
	{
		channel: channel
	};

	let message =
	"Just a heads up that I can read this channel, if you don't want that, make sure " +
	"to turn off my ability to read messages in this channel's permission settings.\n\n" +
	"Note: This will not work if I still have Admin permissions on your server. Run `" +
	"fg reinvite` to see how and why you should remove them."

	BotTools.send(options, message, true);
}

module.exports =
{
	run: run
};