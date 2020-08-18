"use strict";

const fs = require("fs");
const commands = require("./../../scripts/commands.js");
const Tools = require("./../../scripts/botTools.js");

class ImageShare extends commands.Command {
	constructor(name, images) {
		super
		(
			name,
			function (message, options) {

				let returnUrl = (index, reactions, showTags = true) =>
				{
					let img = images[index];
					let content = img.link;
					let returnList = [];

					if (showTags)
					{
						let tags = `\`${img.tags.join(", ")}\`\n`;
						let msg = new commands.Command.TextMessage(message, tags);

						returnList.push(msg);
					}

					let msg = new commands.Command.TextMessage(message, content);
					returnList.push(msg);

					if (reactions) {
						reactions.forEach( (e) =>
						{
							returnList.push(new commands.Command.ReactEmote(message, e) );
						});
					}

					return returnList;
				};

				let randAll = Tools.randNumber(images.length - 1);

				let pick = options[0];
				if (pick) {

					let list = [];
					images.forEach( function(e, i) {
						if (e.tags.includes(pick.toLowerCase()) ) {
							list.push(i);
						}
					});

					if (list.length > 0) {
						return returnUrl(Tools.randArray(list), ["🔍", "✅"], false);
					} else {
						return returnUrl(randAll, ["🔍", "❌", "🎲"]);
					}
				}

				return returnUrl(randAll, ["🎲"]);
			},
			`Get ${name} pictures!`,
			"images",
			["tag"],
			false,
			[],
			[name.toLowerCase()]
		);
		this.images = images;
	}
}

let newcommands = [];
let path = "./files/commands/image";

let dir = fs.readdirSync(path);
dir.forEach( (e) =>
{
	if (!e.endsWith(".json") ) return;

	let imgObj = JSON.parse(fs.readFileSync(`${path}/${e}`) );

	let img = new ImageShare(imgObj.name, imgObj.images);

	newcommands.push(img);
});

module.exports = newcommands;