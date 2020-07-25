"use strict";

function run (message, args)
{
	let channels = message.guild.channels;

	channels.create("Musical VC",
	{
		type: "category"
	}).then( (categoryChannel) =>
	{
		message.client.muscialChannel = categoryChannel;

		channels.create("lobby-text",
		{
			type: "text",
			parent: categoryChannel
		});

		channels.create("Lobby",
		{
			type: "voice",
			parent: categoryChannel
		});

		for (let i = 0; i < 8; i++)
		{
			channels.create(`Chair ${i + 1}`,
			{
				type: "voice",
				userLimit: 1,
				parent: categoryChannel
			});
		}
	});
}

module.exports =
{
	name: "Test",
	description: "Test Command.",
	calls:
	[
		"test"
	],
	runFunction: run,
	permissions: ["BOT_OWNER"]
};