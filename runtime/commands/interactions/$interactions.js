"use strict";

const commands = root_require("commands.js");
const tools = root_require("tools.js");
const actions = root_require("actions.js");

const extension = ".json";

class InteractionCommand extends commands.Command
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
		"user": tools.bold(options.member.displayName),
	};
	let script_to_run = this.script;

	let members = tools.get_mentions(options);
	if (members)
	{
		let names = [];
		members.forEach( (member) =>
		{
			names.push(tools.bold(member.displayName) );
		});
		replacements["users"] = tools.array_list(names);
	}
	else
	{
		replacements["users"] = "themselves";
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