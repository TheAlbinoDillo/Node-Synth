"use strict";

const Discord = require("discord.js");
const Command = require("./../../scripts/commandConst.js");
const Tools = require("./../../scripts/botTools.js");

function run (message, args)
{
	let g = message.guild;
	let url = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;

	let embed = new Discord.MessageEmbed()
	.setTitle(`Information for ${g.name}`)
	.setThumbnail(url)
	.addField("Server Owner:", Tools.serverName(g.owner.user, g), true)
	.addField("Created On:", `${g.createdAt.toLocaleString('default',{month:'long'})} ${g.createdAt.getFullYear()}`, true)
	.addField("Member Count:", `${g.memberCount} users`, true)
	.setFooter(`${g.region} • ${g.id} • ${g.owner.user.username}#${g.owner.user.discriminator}`);

	return new Command.TextMessage(message, embed);
}

module.exports =
{
	name: "Server Information",
	description: "Get information about the server.",
	calls:
	[
		"sinfo",
		"serverinfo"
	],
	runFunction: run
};