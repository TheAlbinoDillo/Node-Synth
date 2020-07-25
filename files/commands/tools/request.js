"use strict";

const Discord = require("discord.js");
const Command = require("./../../scripts/commandConst.js");
const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{		
	let guild = "704494659400892458";
	let channel = "718827126878371881";

	let embed = new Discord.MessageEmbed()
	.setTitle(`Request from ${message.author.username}#${message.author.discriminator}`)
	.setThumbnail(message.author.displayAvatarURL() )
	.addField(`${message.guild.name}/#${message.channel.name}`, args.full);

	return [new Command.Transpose(embed, guild, channel), new Command.ReactEmote(message, "✅")];
}

module.exports =
{
	name: "Request",
	description: "Make a suggestion for bot changes",
	calls:
	[
		"request"
	],
	runFunction: run,
	usage: ["text"]
};