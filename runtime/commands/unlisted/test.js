"use strict";

const {registerFont, createCanvas, loadImage} = require('canvas');
const Actions = script_require("actions.js");
const Tools = script_require("tools.js");

registerFont("./fonts/whitney-book.otf", { family: "Whitney" });

async function run (options)
{
	let members = Tools.get_mentions(options, true, false);

	if (!members[0])
	{
		members[0] = options.member;
	}

	const canvas = createCanvas(300, 70);
	const context = canvas.getContext('2d');

	let image = await loadImage(members[0].user.avatarURL().replace("webp", "png") );

	context.fillStyle = "#36393f";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.save();
	context.beginPath();
	context.arc(35, 35, 25, 0, Math.PI * 2, true);
	context.closePath();
	context.clip();

	context.drawImage(image, 10, 10, 50, 50);

	context.beginPath();
	context.arc(10, 10, 25, 0, Math.PI * 2, true);
	context.clip();
	context.closePath();
	context.restore();

	context.font = "18px 'Whitney'";
	context.fillStyle = members[0].displayHexColor;
	let text = members[0].displayName;
	let textMeasure = context.measureText(text);
	context.fillText(text, 80, 28);

	context.font = "15px 'Whitney'";
	context.fillStyle = "grey";
	context.fillText("Today at 6:07 PM", 80 + textMeasure.width + 10, 28);

	context.font = "18px 'Whitney'";
	context.fillStyle = "white";
	context.fillText(options.full, 80, 55);

	let toSend =
	{
		files:
		[
			{
				attachment: canvas.toBuffer(),
				name: 'capture.png'
			}
		]
	};

	Actions.send(options, toSend);
}

module.exports =
{
	name: "Test",
	calls: ["test"],
	run: run
}