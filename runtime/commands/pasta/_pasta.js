"use strict";

const extension = ".txt";
const splitTag = "<br>";
const nsfwTag = "<!nsfw>";

const fs = require("fs");

let Commands = [];
let path = "./runtime/commands/pasta";

let pasta_dir = fs.readdirSync(path);
pasta_dir.filter( (file) =>
{
	return file.endsWith(extension);

}).forEach( (file) =>
{
	let withoutExt = file.substring(0, file.length - extension.length);
	let name = withoutExt[0].toUpperCase() + withoutExt.substring(1);

	let text = BotTools.load_file(`${path}/${file}`).toString();

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
				BotActions.send(options, element);
			});
		}
	};
	Commands.push(new_command);
});

module.exports = Commands;