"use strict";

const fs = require("fs");

// RegEx to test for the prefix call and command
const commandTest = /(?<prefix>^fg(?:\. |[^a-z0-9?]))(?<call>[^\s<]+) ?(?<options>.+)*/gi;

// RegEx to seperate the options out
const optionsTest = /[^\s]+|(?:"[^"]*"|`[^`]*`|'[^']*')/g;

function parseCommand (string)
{
	// reset commandTest RegEx pointer
	commandTest.lastIndex = 0;

	// Run the commandTest RegEx to get compenents of a
	// command (if there are any to get)
	let commandMsg = commandTest.exec(string);

	// Fail if no command structured matches were found
	if (!commandMsg)
		return null;

	// Breakout commandMsg object properties
	let groups = commandMsg.groups;

	// Breakout groups object properties
	let prefix = groups.prefix;
	let call = groups.call.toLowerCase();
	let cmdOptions = groups.options;
	let cmdArgs;

	// If there are options with the command
	// replace them with a structured array
	if (cmdOptions)
	{
		let matches = cmdOptions.match(optionsTest);
		cmdArgs = matches;
	}

	let obj =
	{
		prefix: prefix,
		call: call,
		cmdOptions: cmdOptions,
		cmdArgs: cmdArgs
	};
	return obj;
}

function upperFirst (string)
{
	return string[0].toUpperCase() + string.substring(1);
}
	
function subEnd (string, count)
{
	return string.substring(0, string.length - count);
}

function loadFile (path)
{
	return fs.readFileSync(path);
}

function loadJSON (path)
{
	return JSON.parse(loadFile(path) );
}

async function send (options, content, embedWrap)
{
	let channel = options.channel;
	let message = options.message;

	if (!channel) {
		console.error("Did not provide a channel to botSend.\n");
		return null;
	}

	if (typeof content === 'string' || content instanceof String) {
		if (content.trim() == "") {
			console.error("Message content is empty, this would fail. Did not send message.\n");
			return null;
		} else if (content.length > 2000) {
			console.error("Message content exceeds 2000 characters, this would fail. Did not send message.\n");
			return null;
		}
	}

	if (embedWrap)
	{
		let embed =
		{
			title: content
		};
		content = {embed: embed};
	}

	let sent = channel.send(content);

	if (!message)
		return;

	sent.catch(error =>
	{
		console.error(`Error sending message:\n${error.message}\n`);
		if (message) {
			errorReact(message, "‼️", `\`${message.content}\`\nMessage error: ${error.message}`);
		}
	});

	return sent;
}

function randNumber (max, min = 0)
{
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randArray (array)
{
	let pick = randNumber(array.length - 1);
	return array[pick];
}

function pickFrom (value)
{
	if (typeof value === 'string' || value instanceof String)
	{
		return value;
	}
		
	let choice = Math.floor(Math.random() * value.length);
		
	return pickFrom(value[choice]);	
}

function JSONscript (replacements, script)
{
	let array = script.slice();
	let string = "";

	array.forEach( (element) =>
	{
		string += pickFrom(element);
	});
		
	for (let replace in replacements)
	{
		let regex = new RegExp(`%${replace}%`, "g");
		string = string.replace(regex, replacements[replace]);
	}
	return string;
}

function bold (text)
{
	return `**${text}**`;
}

function arrayList (array, join_word = "and", oxford = true)
{
	let length = array.length;
	switch (length)
	{
		case 1:
			return array[0];
			break;
		case 2:
			return `${array[0]} ${join_word} ${array[1]}`;
			break;
		default:
			let last = array.pop();
			return `${array.join(", ")}, ${join_word} ${last}`;
			break;
	}
}

function getMentions (options, remove_self = true, remove_bot = true)
{
	let members = options.message.mentions.members.array();
	
	if (members.length === 0) return [];

	if (remove_self)
	{
		members = members.filter( (a) =>
		{
			return a !== options.member;
		});
	}
	if (remove_bot)
	{
		members = members.filter( (a) =>
		{
			return !a.user.bot;
		});
	}
	return members;
}

function clean (string)
{
	let replacements = ["*", "\\", "_", "~", ":", "#"];
	replacements.forEach( (e) =>
	{
		string = string.replace(e, `\\${e}`);
	});

	string = string.replace(/@everyone/g, "@\u200beveryone");
	string = string.replace(/@</g, "<\u200b@");

	return string;
}

//Export class
module.exports =
{
	upperFirst: upperFirst,
	subEnd: subEnd,
	loadFile: loadFile,
	loadJSON: loadJSON,
	send: send,
	randNumber: randNumber,
	randArray: randArray,
	pickFrom: pickFrom,
	JSONscript: JSONscript,
	bold: bold,
	arrayList: arrayList,
	getMentions: getMentions,
	clean: clean,
	parseCommand: parseCommand
};