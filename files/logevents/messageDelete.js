"use strict";

function run (message)
{
	let embed =
	{
		"title": "🗑️ Message Delete",
		"fields":
		[
			{
				"name": "👤 User:",
				"value": message.author,
				"inline": true
			},
			{
				"name": "📲 Channel:",
				"value": message.channel,
				"inline": true
			},
			{
				"name": "Message:",
				"value": message.content || "undefined"
			}
		],
		"footer":
		{
			"text": `❄️ ${message.id} • `
		},
		"timestamp": new Date(message.createdTimestamp).toJSON();
	};

	return embed;
}

Client.on("messageDelete", (message) =>
{
	serverEvent(message.guild, "🗑️ Message Delete", message.author, Date.now(), message);
});

module.exports =
{
};