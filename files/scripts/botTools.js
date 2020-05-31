const FileSystem = require("fs");
const Debug = require("./runningOnPi.js");
const Color = require("./colors.js");

const settingsPath = Debug.isDebug ? "C:/Users/mojo4/AppData/Roaming/FurGunData/servers" : "/home/pi/fwg/settings/servers";

function serverName (user, guild, bold = true, removeSpecial = true) {	//Get the server nickname of a user and clean it up

	if (guild == undefined) {
		console.error("A guild was not provided. Did not get server name of user.\n")
	}

	let name = guild.member(user).nickname;
	let regex = /([❄]|[\u2B50]|[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
	//let regex = /([^\u0000-\u007f])/gi;

	if (removeSpecial && name != null) {	//Remove emojis and symbol characters, uppercase the first letter
		name = name.replace(/[-_]/g,' ').replace(regex, '').trim();
		name = `${name[0].toUpperCase()}${name.substring(1)}`;

		if (user.id == "662825806967472128") {
			name = "me";
		}

		if (name.length <= 1) {
			name = null;
		}
	}

	return `${bold ? "**" : ""}${name ? name : user.username}${bold ? "**" : ""}`;
}

function getMentionList (message, returnNames, removeSelf = true, removeBots = false) {	//Get all the user mentions in a message

	let rawMentions = message.mentions.users.array();
	let mentions = [];

	for (let i = 0, l = rawMentions.length; i < l; i++) {	//Remove the user writing the message or any bots
		
		let rmi = rawMentions[i];
		if ( !( (rmi == message.author && removeSelf) || (rmi.bot && removeBots) ) ) {
			mentions.push(rmi);
		}
	}

	if (returnNames) {	//Turn mentions into server names
		for (let i = 0, l = mentions.length; i < l; i++) {
			mentions[i] = serverName(mentions[i], message.guild);
		}
	}

	return mentions;
}

function writeJSON (filename, object, quiet = false) {	//Write an object to a JSON file

	let string = JSON.stringify(object);

 	try {
		FileSystem.writeFileSync(`${filename}.json`, string);
		if (!quiet) {
			console.log(`Wrote to "${filename}.json":\n${string}\n`);
		}
	} catch (error) {
		console.error(`Failed to write to "${filename}.json":\n${error.message}\n`);
	}
}

function readJSON (filename, quiet = false) {	//Read an object from a JSON file

	let content;
	try {
		content = FileSystem.readFileSync(`${filename}.json`);
		if (!quiet) {
			console.log(`Read from "${filename}.json":\n${(content.length > 100) ? `${content.toString().substring(0, 150)}...` : content}\n`);
		}
	} catch (error) {
		console.error(`Failed to read from "${filename}.json":\n${error.message}\n`);
		return null;
	}

	return JSON.parse(content);
}

function writeSetting (guild, valueTag, value, addTo = false) {

	let filename = `${settingsPath}/${guild.id}`;
	let settings = readSetting(guild);

	if (settings == null) {

		settings = {name: guild.name};
		console.log(`No settings file detected, created "${guild.id}" for "${guild.name}"\n`);
		writeJSON(filename, settings);
	}

	if (settings[valueTag] == undefined) {

		settings[valueTag] = [];
	}

	if (addTo) {
		settings[valueTag].push(value);
	} else {
		settings[valueTag] = value;
	}

	writeJSON(filename, settings, true);
	console.log(`${addTo ? "Added to" : "Set"} value "${valueTag}" in "${guild.name}":\n${value}\n`);
}

function readSetting (guild, valueTag = null) {

	let filename = `${settingsPath}/${guild.id}`;
	let settings = readJSON(filename, true);

	if (valueTag == null) {
		return settings;
	}

	if (settings == null) {
		console.error(`No settings for "${guild.name}" were ever set.`);
		return null;
	}

	if (settings[valueTag] == undefined) {
		console.error(`The "${valueTag}" setting for "${guild.name}" was never set.`);
		return undefined;
	}

	console.log(`Read setting "${valueTag}" for "${guild.name}":\n${settings[valueTag]}\n`);
	return settings[valueTag];
}

function makeUwU (string) {

	let text = string.replace(/R/g, 'W').replace(/r/g, 'w').replace(/L/g, 'W').replace(/l/g, 'w');

	return text;
}

function arrayIntoList (array) {	//Turn an array into a human-readable list

	let l = array.length;

	if (l == 0) {
		return undefined;
	}

	let text = "";
	if (l <= 2) {
		text += (l == 2) ? `${array[0]} and ${array[1]}` : `${array[0]}`;
	} else {
		for (let i = 0; i < l; i++) {
			text += `${(i == l - 1) ? " and " : ""}${array[i]}${(i < l - 2) ? ", " : ""}`;
		}
	}

	return text;
}

function randArray (array) {	//Randomly pick from an array
	let pick = Math.floor(Math.random() * array.length);
	return array[pick];
}

function randNumber (max) {
	return Math.floor(Math.random() * max);
}


module.exports =
{
	isDebug: Debug.isDebug,
	serverName: serverName,
	getMentionList: getMentionList,
	settings:
	{
		read: readSetting,
		write: writeSetting
	},
	makeUwU: makeUwU,
	arrayIntoList: arrayIntoList,
	randArray: randArray,
	randNumber: randNumber,
	colors:
	{
		closest: Color.closest,
		format: Color.format
	}
};