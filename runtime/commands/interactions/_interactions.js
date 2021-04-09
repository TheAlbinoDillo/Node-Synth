"use strict";

const extension = ".json";
const fs = require("fs");

let Commands = [];

let path = "./runtime/commands/interactions";

async function runFunction (options)
{
	let replacements =
	{
		"user": BotTools.bold(BotTools.clean(options.member.displayName) ),
		"users": "themselves"
	};
	let script_to_run = this.script;

	let members = BotTools.get_mentions(options, true, false);

	if (members.length > 0)
	{
		let names = [];
		members.forEach( (member) =>
		{
			if (member.id === options.client.user.id)
			{
				names.push("**me**");
			}
			else
			{
				names.push(BotTools.bold(BotTools.clean(member.displayName) ) );
			}
		});
		replacements["users"] = BotTools.array_list(names);
	}
	else if (this.self)
	{
		script_to_run = this.self;
	}

	let text = BotTools.json_script(replacements, script_to_run);
	BotActions.send(options, text);
}


let pasta_dir = fs.readdirSync(path);
pasta_dir.filter( (file) =>
{
	return file.endsWith(extension);

}).forEach( (file) =>
{
	let json = BotTools.loadJSON(`${path}/${file}`);

	let new_command =
	{
		name: json.name,
		desc: json.description,
		nsfw: json.nsfw,
		calls: json.calls,
		self: json.self,
		script: json.script,
		run: runFunction,
		category: "interactions",
		perms: []
	};
	Commands.push(new_command);
});


module.exports = Commands;