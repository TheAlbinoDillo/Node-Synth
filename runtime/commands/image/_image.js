"use strict";

const fs = require("fs");
const extension = ".json";

let Commands = [];

let path = "./runtime/commands/image";
let image_dir = fs.readdirSync(path);
image_dir.filter( (file) =>
{
	return file.endsWith(extension);

}).forEach( (file) =>
{
	let withoutExt = BotTools.subEnd(file, extension.length);

	let name = BotTools.upperFirst(withoutExt);

	let is_vowel = "aeiouAEIOU".includes(name[0]);
	let desc = `Send ${is_vowel ? "an" : "a"} ${name} image!`;

	let new_command =
	{
		name: name,
		desc: desc,
		perms: [],
		category: "image",
		json: JSON.parse(BotTools.load_file(`${path}/${file}`) ),
		async run (options)
		{
			let link = BotTools.rand_array(this.json.images).link;
			BotActions.send(options, link);
		}
	};
	Commands.push(new_command);
});

module.exports = Commands;