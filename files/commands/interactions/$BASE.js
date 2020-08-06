"use strict";

const fs = require("fs");
const Command = require("./../../scripts/commandConst.js");
const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	let replacements =
	{
		user: `${Tools.serverName(message.author, message.guild)}`,
		users: Tools.arrayIntoList(Tools.getMentionList(message, true) ),
		args_full: args.full
	};

	let parseScript = (script) =>
	{
		return Tools.JSONscript(replacements, script);
	};

	if (!replacements.users && !this.self) {
		replacements.users = this.defaultWord;
	}

	if (replacements.users || !this.self) {
		return parseScript(this.others);
	} else {
		return parseScript(this.self);
	}
}

class Interaction extends Command.Command {
	constructor(name, description, others, self, calls = [], defaultWord = "themselves") {
		super
		(
			name,
			run,
			description,
			"interactions",
			["@user1 @user2 @user.."],
			false,
			[],
			calls
		);
		this.others = others;
		this.self = self;
		this.defaultWord = defaultWord;
	}
}

let commands = [];
let path = "./files/commands/interactions";

let isJSON = (name) =>
{
	let suffix = ".json";
	return name.indexOf(suffix) == name.length - suffix.length;
};

let dir = fs.readdirSync(path);
dir.forEach( (e) =>
{
	if (!isJSON(e) ) return;

	let intObj = JSON.parse(fs.readFileSync(`${path}/${e}`) );

	let int = new Interaction
	(
		intObj.name,
		intObj.description,
		intObj.script,
		intObj.self,
		intObj.calls,
		intObj.defaultWord
	);

	commands.push(int);
});

module.exports = commands;