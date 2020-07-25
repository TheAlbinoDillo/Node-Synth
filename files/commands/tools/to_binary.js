"use strict";

function formatBin (string)
{
	let text = string.toString(2);
	
	while (text.length < 8)
	{
		text = `0${text}`;
	}
	return text;
}

function run (message, args)
{
	if (Number.isNaN(parseInt(args[0]) ) )
	{
		let content = args.full;

		let text = "";
		for (let i = 0, l = content.length; i < l; i++)
		{
			text += `\`${formatBin(content.charCodeAt(i) )}\` `;
		}
		return text;
	}
	return parseInt(args[0]).toString(2);
}

module.exports =
{
	name: "To Binary",
	description: "Turn something into binary!",
	calls:
	[
		"bin",
		"binary",
		"tobin",
		"tobinary"
	],
	runFunction: run,
	usage: ["text"]
};