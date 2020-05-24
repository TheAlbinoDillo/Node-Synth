const FileSystem = require("fs");

module.exports = {
	arrayIntoList: arrayIntoList,
	randArray: randArray,
	writeJSON: writeJSON,
	readJSON: readJSON
};

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

function writeJSON (filename, object) {	//Write an object to a JSON file

	let string = JSON.stringify(object);

 	try {
		FileSystem.writeFileSync(`./files/${filename}.json`, string);
		botLog(`Wrote to "${filename}.json":\n${string}\n`);
	} catch (error) {
		botError(`Failed to write to "${filename}.json":\n${error.message}\n`);
	}
}

function readJSON (filename) {	//Read an object from a JSON file

	let content;
	try {
		content = FileSystem.readFileSync(`./files/${filename}.json`);
		botLog(`Read from "${filename}.json":\n${(content.length > 100) ? `${content.toString().substring(0, 150)}...` : content}\n`);
	} catch (error) {
		botError(`Failed to read from "${filename}.json":\n${error.message}\n`);
		return null;
	}

	return JSON.parse(content);
}