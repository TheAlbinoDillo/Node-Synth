"use strict";

const Command = script_require("Command.js");
const Tools = script_require("tools.js");
const Actions = script_require("actions.js");

const extension = ".txt";
const splitTag = "<br>";
const nsfwTag = "<!nsfw>";

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
	let pasta_dir = Tools.list_dir(path);
	pasta_dir.files.filter( (file) =>
	{
		return file.filename.endsWith(extension);

	}).forEach( (file) =>
	{
		let withoutExt = file.filename.substring(0, file.filename.length - extension.length);
		let name = withoutExt[0].toUpperCase() + withoutExt.substring(1);

		let text = Tools.load_file(file.path).toString();

		let isNSFW = false;
		let newText = text.replace(nsfwTag, "");

		if (newText !== text)
		{
			isNSFW = true;
			text = newText;
		}
		text = text.split(splitTag)

		let new_command =
		{
			name: name,
			desc: `Send the ${name} copypasta!`,
			text: text,
			nsfw: isNSFW,
			category: "pasta",
			perms: [],
			async run (options)
			{
				this.text.forEach( (element) =>
				{
					Actions.send(options, element);
				});
			}
		};
		new PastaCommand(new_command);
	});
};