"use strict";

async function run (message, args)
{
	if (Number.isNaN(parseInt(args[0]) ) )
	{
		let content = args.full;

		let text = "";
		for (let i = 0, l = content.length; i < l; i++)
		{
			text += `\`${formatHex(content.charCodeAt(i) )}\` `;
		}
		return text.toUpperCase();
	}
	return `\`0x${parseInt(args[0]).toString(16).toUpperCase()}\``;
}

function formatHex (string) {

	let text = string.toString(16);
	while (text.length < 2) {
		text = `0${text}`;
	}
	return text;
}

module.exports =
{
	name: "To Hexadecimal",
	description: "Turn something into hexadecimal!",
	calls:
	[
		"tohex",
		"tohexadecimal"
	],
	runFunction: run,
	usage: ["text"]
};