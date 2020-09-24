"use strict";

const actions = script_require("actions.js");

const name = "node-log";

async function run (member)
{
	let guild = member.guild;
	let channels = guild.channels.cache;
	let logChannel = channels.find( (channel) =>
	{
		return channel.name === name;

	}).id;

	if (logChannel)
	{
		let options =
		{
			channel: logChannel
		}

		let msg = "";

		actions.send(options, );
	}
}