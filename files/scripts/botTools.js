const FileSystem = require("fs");
const Debug = require("./runningOnPi.js");
const Color = require("./colors.js");

const settingsPath = Debug.isDebug ? "C:/Users/mojo4/AppData/Roaming/FurGunData/servers" : "/home/pi/fwg/settings/servers";
var cachedSettings = [];

function serverName (user, guild, bold = true, removeSpecial = true) {	//Get the server nickname of a user and clean it up

	if (guild == undefined) {
		console.error("A guild was not provided. Did not get server name of user.\n")
	}

	let name = guild.member(user).nickname;
	let regex = /([❄]|[\u2B50]|[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g;
	//let regex = /([^\u0000-\u007f])/gi;

	if (removeSpecial && name != null) {	//Remove emojis and symbol characters, uppercase the first letter
		name = name.replace(/[-_]/g,' ').replace(regex, '').trim();

		if (name.length <= 1) {
			name = null;
		} else {
			name = `${name[0].toUpperCase()}${name.substring(1)}`;
		}
	}

	if (user.id == "662825806967472128") {
		name = "me";
	}

	return `${bold ? "**" : ""}${name ? name : user.username}${bold ? "**" : ""}`;
}

function getMentionList (message, returnNames, removeSelf = true, removeBots = false) {	//Get all the user mentions in a message

	let rawMentions = message.mentions.users.array();
	let mentions = [];

	for (let i = 0, l = rawMentions.length; i < l; i++) {	//Remove the user writing the message or any bots
		
		let rmi = rawMentions[i];
		if ( !( (rmi == message.author && removeSelf) /*|| (rmi.bot && removeBots)*/ ) ) {
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

function writeJSON (filename, object) {	//Write an object to a JSON file

	let string = JSON.stringify(object);

 	try {
		FileSystem.writeFileSync(`${filename}.json`, string);
		console.log(`Wrote to "${filename}.json":\n${string}\n`);
	} catch (error) {
		console.error(`Failed to write to "${filename}.json":\n${error.message}\n`);
	}
}

function readJSON (filename) {	//Read an object from a JSON file

	let content;
	try {
		content = FileSystem.readFileSync(`${filename}.json`);
		console.log(`Read from "${filename}.json":\n${(content.length > 100) ? `${content.toString().substring(0, 150)}...` : content}\n`);
	} catch (error) {
		console.error(`Failed to read from "${filename}.json":\n${error.message}\n`);
		return null;
	}

	return JSON.parse(content);
}

function writeSetting (guild, valueTag, value, addTo = false) {

	let filename = `${settingsPath}/${guild.id}`;
	let guildSet = `"${guild.id}" (${guild.name})`;
	let ws = "writeSetting:\n";

	console.log(`${ws}Fetching settings.\n`);
	let settings = readSetting(guild);

	if (!settings[valueTag]) {
		console.log(`${ws}No setting of "${valueTag}" for ${guildSet} was ever made, creating one.`);
		
		if (Array.isArray(value) ) {

			console.log("Set as empty array.\n");
			settings[valueTag] = [];
		} else if (value instanceof Object) {

			console.log("Set as empty object.\n");
			settings[valueTag] = {};
		} else {

			console.log("Set as empty string.\n");
			settings[valueTag] = "";
		}
	}

	if (addTo) {

		let svt = settings[valueTag];
		if (Array.isArray(svt) ) {

			settings[valueTag] = settings[valueTag].concat(value);
		} else if (svt instanceof Object) {

			settings[valueTag] = Object.assign(svt, value);
		} else {

			settings[valueTag] += value;
		}
	} else {
		settings[valueTag] = value;
	}

	writeJSON(filename, settings);

	cachedSettings[guild.id] = settings;
}

function readSetting (guild, valueTag = null) {

	let filename = `${settingsPath}/${guild.id}`;
	let guildSet = `"${guild.id}" (${guild.name})`;
	let rs = "readSetting:\n";

	let settings = null;

	let csgi = cachedSettings[guild.id];
	if (csgi === undefined) {
		console.log(`${rs}Reading to populate the settings cache.\n`);
		csgi = readJSON(filename);
	
		if (!csgi) {
			console.log(`${rs}Creating new settings file for ${guildSet}.\n`);
			writeJSON(filename, {name: guild.name});
			return readSetting(guild, valueTag);
		} else {
			console.log(`${rs}Loaded ${guildSet} into settings cache.\n`);
			cachedSettings[guild.id] = csgi;
		}
	}

	settings = csgi;

	if (!settings) {
		console.error(`${rs}No settings file for ${guildSet} was ever made.\n`);
		return null;
	}

	if (!valueTag) {
		if (valueTag === undefined) {
			console.error(`${rs}The value to request was undefined for ${guildSet}.\n`);
			return null;
		}
		return settings;
	}

	if (!settings[valueTag]) {
		console.error(`${rs}The "${valueTag}" setting for ${guildSet} was never set.\n`);
		return null;
	}

	//console.log(`${rs}Setting "${valueTag}" for ${guildSet} returned:\n${settings[valueTag]}\n`);
	return settings[valueTag];
}

function makeUwU (string) {

	let text = string.replace(/R/g, 'W').replace(/r/g, 'w').replace(/L/g, 'W').replace(/l/g, 'w');

	return text;
}

function formatBin (string) {

	let text = string.toString(2);
	while (text.length < 8) {
		text = `0${text}`;
	}
	return text;
}

function formatHex (string) {

	let text = string.toString(16);
	while (text.length < 2) {
		text = `0${text}`;
	}
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

function randNumber (max, min = 0) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function disconnect (client, seconds = 3) {

	console.log(`Disconnecting Client and ending nodeJS script in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);

	client.setTimeout( () => {
		client.destroy();
		process.exit(621);
	}, seconds * 1000);
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
	},
	disconnect: disconnect,
	formatBin: formatBin,
	formatHex: formatHex
};