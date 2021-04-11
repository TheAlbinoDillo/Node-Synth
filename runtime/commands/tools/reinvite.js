"use strict";

async function run (options)
{
	let embed =
		{
		"title": "Please re-invite Node Synth",
		"description": "I'm moving away from using admin permissions for my commands. " +
		"Please take the time to use `fg invite` to fix my authority on this server. " +
		"This will also give you a chance to review what permissions are needed for my service.",
		"fields":
		[
			{
				"name": "Why?",
				"value": "Having Admin status is unnecessary for completing my commands. " +
				"It also prevents you from being able block me from channels you may not " +
				"want me to read.\n\nAlso, under the slim possiblity that anyone gets " +
				"my bot token, they could gain full control of your server via my " +
				"abilities. This is, however, just a worst case scenario."
			},
			{
				"name": "Alternatively",
				"value": "You may also manually review and change my permissions by editing" +
				" the `NodeSynthBot` role in your server role settings."
			}
		]
	};

	BotActions.send(options, {embed: embed});
}

module.exports =
{
	name: "Reinvite",
	calls: ["reinvite"],
	run: run,
	perms: []
};