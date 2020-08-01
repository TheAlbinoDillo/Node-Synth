"use strict";

const index = require("./../../index.js");
const perms =
[
    "ADMINISTRATOR",
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "ADD_REACTIONS",
    "VIEW_AUDIT_LOG",
    "PRIORITY_SPEAKER",
    "STREAM",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "SEND_TTS_MESSAGES",
    "MANAGE_MESSAGES",
    "EMBED_LINKS",
    "ATTACH_FILES",
    "READ_MESSAGE_HISTORY",
    "MENTION_EVERYONE",
    "USE_EXTERNAL_EMOJIS",
    "VIEW_GUILD_INSIGHTS",
    "CONNECT",
    "SPEAK",
    "MUTE_MEMBERS",
    "DEAFEN_MEMBERS",
    "MOVE_MEMBERS",
    "USE_VAD",
    "CHANGE_NICKNAME",
    "MANAGE_NICKNAMES",
    "MANAGE_ROLES",
    "MANAGE_WEBHOOKS",
    "MANAGE_EMOJIS"
];


function run (role)
{
	let permList = "";
	perms.forEach( (e) =>
	{
		if (role.permissions.has(e) )
		{
			permList += e + "\n";
		}
	});

	let embed =
	{
		"title": "🎟️ Role Created",
		"color": role.color,
		"fields":
		[
			{
				"name": "Name:",
				"value": role.name
			},
			{
				"name": "Hoisted:",
				"value": role.hoist ? "Yes" : "No"
			},
			{
				"name": "Permissions:",
				"value": permList
			}
		],
		"footer":
		{
			"text": `❄️ ${role.id}`
		},
		"timestamp": new Date().toJSON()
	};

	index.serverEvent({guild: role.guild, embed: embed});
}

module.exports =
{
	runFunction: run
};