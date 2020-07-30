"use strict";

//const Discord = require("discord.js");
//const Command = require("./../../scripts/commandConst.js");
const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	try
	{
		let sthis = JSON.parse(args.full);

		let replacements =
		{
			user: `**${message.member.displayName}**`,
			users: Tools.arrayIntoList(Tools.getMentionList(message, true) ),
			args_full: args.full
		};
	
		let parseScript = (script) =>
		{
			return Tools.JSONscript(replacements, script);
		};
	
		if (!replacements.users && !sthis.self) {
			replacements.users = this.defaultWord;
		}
	
		if (replacements.users || !sthis.self) {
			return parseScript(sthis.others);
		} else {
			return parseScript(sthis.self);
		}
	}
	catch (err)
	{
		return err;
	}
}

module.exports =
{
	name: "Test Interaction",
	description: "Test an interaction JSON!",
	calls:
	[
		"testinteraction"
	],
	runFunction: run
};