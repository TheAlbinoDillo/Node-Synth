"use strict";

const commands = root_require("commands.js");
const tools = root_require("tools.js");

const extension = ".json";

class InteractionCommand extends commands.Command
{
	constructor (options)
	{
		super (options);
		this.text = options.text;
	}
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
			async run (options)
			{
				
				
				return tools.json_script(this.self);
			},
			perms: []
		};
		new InteractionCommand(new_command);
	});
};