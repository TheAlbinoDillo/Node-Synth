var fs = require("fs");
var content = fs.readFileSync(`./files/common/hexcolors.json`);
var obj = JSON.parse(content);

closest("##FFFF70");

function closest (hexstring) {
	let num = parseInt(hexstring.replace(/#/g, ""), 16);
	let add = 0;

	while (obj[format(num + add)] == undefined) {

		if (add == 0) {
			add ++;
		}else if (add > 0) {
			add *= -1;
		}else if (add < 0) {
			add *= -1;
			add ++;
		}
	}

	return obj[format(num + add)];
}

function format (num) {
	let string = num.toString(16);

	for (let i = 0, l = (6 - string.length); i < l; i ++) {
		string = "0" + string;
	}

	return "#" + string.toUpperCase();
}

module.exports =
{
	closest: closest,
	format: format
};