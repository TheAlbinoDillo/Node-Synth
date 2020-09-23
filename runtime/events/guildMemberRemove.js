"use strict";

const commands = root_require("commands.js");
const actions = root_require("actions.js");
const index = root_require("index.js");

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