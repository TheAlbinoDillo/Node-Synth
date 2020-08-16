"use strict";

const index = root_require("index.js");
const tools = root_require("tools.js");

const extension = ".txt";
const split_tag = "<br>";

class PastaCommand extends index.Command
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
			async run (options)
			{
				return this.text;
			}
		};
		new PastaCommand(new_command);
	});
};