"use strict";

const fs = require("fs");
var debug = false;

try {
	var buffer = fs.readFileSync("C:/Users/mojo4/AppData/Roaming/FurGunData/debug.json");
	debug = true;
} catch (error) {
	//No debug file
}

module.exports = debug;