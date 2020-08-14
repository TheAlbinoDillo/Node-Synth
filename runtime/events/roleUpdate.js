"use strict";

const index = require("./../../index.js");
const diff = require("diff");

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


this.run = (oldRole, newRole) =>
{
	let oldPermsList = "", newPermsList = "";
	perms.forEach( (e) =>
	{
		if (oldRole.permissions.has(e) )
		{
			oldPermsList += e + "\n";
		}
		if (newRole.permissions.has(e) )
		{
			newPermsList += e + "\n";
		}
	});

	let diffText = "";
	let diffObj = diff.diffWords(oldPermsList, newPermsList);

	for (let i in diffObj)
	{
		let suffix = i == diffObj.length - 1 ? "" : "\n";

		let added = diffObj[i].added ? "+" : "";
		let removed = diffObj[i].removed ? "-" : "";
		if (added || removed)
		{
			diffText += `${added || removed}${diffObj[i].value}${suffix}`;
		}
	}
	diffText = "```diff\n" + diffText + "```";

	let embed =
	{
		"title": "🎟️ Role Edited",
		"color": newRole.color,
		"fields":
		[
			{
				"name": "Name:",
				"value": `${oldRole.name} >> ${newRole.name}`
			},
			{
				"name": "Hoisted:",
				"value": `${oldRole.hoist ? "Yes" : "No"} >> ${newRole.hoist ? "Yes" : "No"}`
			},
			{
				"name": "Permission Differences:",
				"value": diffText
			}
		],
		"footer":
		{
			"text": `❄️ ${oldRole.id}, ${newRole.id}`
		},
		"timestamp": new Date().toJSON()
	};

	index.serverEvent({guild: newRole.guild, embed: embed});
};