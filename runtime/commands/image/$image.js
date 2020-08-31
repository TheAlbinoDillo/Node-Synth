"use strict";

const commands = root_require("commands.js");
const tools = root_require("tools.js");
const actions = root_require("actions.js");

const extension = ".json";

class ImageCommand extends commands.Command
{
	constructor (options)
	{
		super (options);
		this.json = options.json;
	}
}

this.run = (options, path) =>
{
	let image_dir = tools.list_dir(path);
	image_dir.files.filter( (file) =>
	{
		return file.filename.endsWith(extension);

	}).forEach( (file) =>
	{
		let withoutExt = tools.subEnd(file.filename, extension.length);

		let name = tools.upperFirst(withoutExt);

		let is_vowel = "aeiouAEIOU".includes(name[0]);
		let desc = `Send ${is_vowel ? "an" : "a"} ${name} image!`;

		let new_command =
		{
			name: name,
			desc: desc,
			perms: [],
			category: "image",
			json: JSON.parse(tools.load_file(file.path) ),
			async run (options)
			{
				let link = tools.rand_array(this.json.images).link;
				actions.send(options, link);
			}
		};
		new ImageCommand(new_command);
	});
};
