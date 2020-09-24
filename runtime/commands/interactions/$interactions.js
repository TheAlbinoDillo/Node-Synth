"use strict";

const Command = script_require("Command.js");
const tools = script_require("tools.js");
const actions = script_require("actions.js");

const extension = ".json";

class InteractionCommand extends Command
{
	constructor (options)
	{
		super (options);
		this.self = options.self;
		this.script = options.script;
	}
}

async function runFunction (options)
{
	let replacements =
	{
		"user": tools.bold(tools.clean(options.member.displayName) ),
		"users": "themselves"
	};
	let script_to_run = this.script;

	let members = tools.get_mentions(options);

	if (members)
	{
		let names = [];
		members.forEach( (member) =>
		{
			names.push(tools.bold(tools.clean(member.displayName) ) );
		});
		replacements["users"] = tools.array_list(names);
	}
	else if (this.self)
	{
		script_to_run = this.self;
	}

	let text = tools.json_script(replacements, script_to_run);
	actions.send(options, text);
}

this.run = (options, path) =>
{
	let pasta_dir = tools.list_dir(path);
	pasta_dir.files.filter( (file) =>
	{
		return file.filename.endsWith(extension);

	}).forEach( (file) =>
	{
		let json = tools.load_json(file.path);

		let new_command =
		{
			name: json.name,
			desc: json.description,
			calls: json.calls,
			self: json.self,
			script: json.script,
			run: runFunction,
			category: "interactions",
			perms: []
		};
		new InteractionCommand(new_command);
	});
};