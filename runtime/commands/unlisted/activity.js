"use strict";

async function run (options)
{
	VarClient.user.setActivity(options.full).then( (presence) =>
	{
		BotActions.send(options, `Activity set to ${presence.activities[0].name}`);
	});
}

module.exports =
{
	run: run,
	name: "Activity",
	calls: ["activity"],
	perms: ["BOT_OWNER"]
};