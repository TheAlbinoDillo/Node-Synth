"use strict";

const fs = require("fs");

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

async function send (options, content)
{
	let channel = options.channel;
	let message = options.message;

	if (!(channel instanceof discord.TextChannel) ) {
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

	let sent = channel.send(content);

	sent.then(message => {}).catch(error =>
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

function rand_array (array)
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

	string = string.replace("@everyone", "@\u200beveryone");
	string = string.replace("<@", "<\u200b@");

	return string;
}

//Export class
module.exports =
{
	upperFirst: upperFirst,
	subEnd: subEnd,
	//list_dir: list_dir,
	loadFile: loadFile,
	loadJSON: loadJSON,
	send: send,
	randNumber: randNumber,
	rand_array: rand_array,
	pickFrom: pickFrom,
	JSONscript: JSONscript,
	bold: bold,
	arrayList: arrayList,
	getMentions: getMentions,
	clean: clean
};