"use strict";

const Command = script_require("Command.js");
const tools = script_require("tools.js");
const actions = script_require("actions.js");

const extension = ".txt";
const split_tag = "<br>";

class PastaCommand extends Command
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
		let withoutExt = file.filename.substring(0, file.filename.length - extension.length);
		let name = withoutExt[0].toUpperCase() + withoutExt.substring(1);

		let new_command =
		{
			name: name,
			desc: `Send the ${name} copypasta!`,
			text: tools.load_file(file.path).toString().split(split_tag),
			category: "pasta",
			perms: [],
			async run (options)
			{
				this.text.forEach( (element) =>
				{
					actions.send(options, element);
				});
			}
		};
		new PastaCommand(new_command);
	});
};