"use strict";

const fs = require("fs");
let content = fs.readFileSync(`./files/common/hexcolors.json`);
const obj = JSON.parse(content);

let list = [];
for (let hex in obj) {
	list.push(hex.toString().substring(1) );
}
obj.list = list;

function format (num) {
	let string = num.toString(16);

	for (let i = 0, l = (6 - string.length); i < l; i ++) {
		string = "0" + string;
	}

	return "#" + string.toUpperCase();
}

function hexDistance (hex1, hex2) {

	let getRGB = (hex) =>
	{
		let rgb = [];
		for (let i = 0; i < 3; i++) {
			rgb[i] = parseInt(hex.substring(i * 2, (i * 2) + 2), 16);
		}

		return rgb;
	};

	let rgb1 = getRGB(hex1);
	let rgb2 = getRGB(hex2);

	let red = rgb2[0] - rgb1[0];
	let green = rgb2[1] - rgb1[1];
	let blue = rgb2[2] - rgb1[2];

	return Math.sqrt( Math.pow(red, 2) + Math.pow(green, 2) + Math.pow(blue, 2) );
}

function hexRound (hex, selection = obj.list) {

	hex = hex.replace("#", "");

	let holder =
	{
		difference: null,
		index: null
	};

	selection.forEach( function(e, i) {

		let distance = hexDistance(hex, e);

		if (distance < holder.difference || holder.difference === null) {
			holder.difference = distance;
			holder.index = i;
		}
	});

	return obj["#" + selection[holder.index]];
}

module.exports =
{
	closest: hexRound,
	format: format
};