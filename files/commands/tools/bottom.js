"use strict";

async function run (message, options)
{
	let list = options;

	for (let i = 0, l = list.length; i < l; i++)
	{
		let em = "";
		for (let n = 0, nl = list[i].length; n < nl; n++)
		{
			let c = list[i].charCodeAt(n);
			em += c < 100 ? `0${c}` : c;
		}
		list[i] = parseInt(em).toString(36);
	}

	for (let i = 0, l = list.length; i < l; i++)
	{
		let em = "";
		for (let n = 0, nl = list[i].length; n < nl; n++)
		{
			let p = parseInt(list[i][n]);
			if (!isNaN(p) )
			{
				em += alpha[p];
				continue;
			}
			em += list[i][n];
		}
		list[i] = em;
	}
	return list.join(" ");
}

module.exports =
{
	name: "Bottom Speak",
	description: "",
	calls:
	[
		"bottom"
	],
	runFunction: run
};