"use strict";

const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	if (args[0] == "FUCKME") {
		return "OwO";
	}

	if (args[0] == null) {
		return `Specify a hex code.`;
	}

	let clean = args[0].replace(/#/g, "");
	console.log(clean);

	if (args[0].replace(/[^a-f0-9]/gi,'').length != 6) {
		return `**${clean}** is not a valid hex code.`;
	}

	let colorName = Tools.colors.closest(clean);
	let colorCode = Tools.colors.format(clean).substring(1);
	let url = `https://via.placeholder.com/50/${colorCode}/${colorCode}.png`;

	let embed =
	{
		title: "Hex Color",
		thumbnail:
		{
			url: url
		},
		fields:
		[
			{
				name: "#" + colorCode,
				value: colorName
			}
		]
	};

	return {embed: embed};
}

module.exports =
{
	name: "Hex Color",
	description: "Get a preview of a hex color!",
	calls:
	[
		"hex",
		"color",
		"hexcolor"
	],
	runFunction: run,
	usage: ["hex value"]
};