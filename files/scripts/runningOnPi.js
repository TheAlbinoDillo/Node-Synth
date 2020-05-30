const FileSystem = require("fs");
var Debug = false;

try {
	var buffer = FileSystem.readFileSync("C:/Users/mojo4/AppData/Roaming/FurGunData/debug.json");
	Debug = true;
} catch (error) {
	console.error("\nDid not find debug file, setting to Pi run.\n");
}

module.exports =
{
	isDebug: Debug
};