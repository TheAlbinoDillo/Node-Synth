"use strict";

const fs = require("fs");
const Command = require("./../../scripts/commandConst.js");

let commands = [];
let path = "./files/commands/pasta";

let isTxt = (name) =>
{
	let suffix = ".txt";
	return name.indexOf(suffix) == name.length - suffix.length;
};

let dir = fs.readdirSync(path);
dir.forEach( (e) =>
{
	if (!isTxt(e) ) return;

	let txtObj = fs.readFileSync(`${path}/${e}`).toString();

	e = e.substring(0, e.length - 4);

	let txt = new Command.Command
	(
		e,
		function (message, options)
		{
			if (txtObj.length <= 2000) return txtObj;

			let strings = [];
			var cut = 2000;

			for (var i = 0; i < Math.ceil(txtObj.length) / cut; i++) {
				var t = txtObj.substring(i * cut,(i * cut) + cut);
				strings.push(t);
			}

			let messages = [];
			strings.forEach( (e) =>
			{
				messages.push(new Command.TextMessage(message, e) );	
			});

			return messages;

		},
		`Send the ${e} copypasta!`,
		"pasta",
		[], false, [],
		[e.toLowerCase()]
	);

	commands.push(txt);
});

module.exports = commands;