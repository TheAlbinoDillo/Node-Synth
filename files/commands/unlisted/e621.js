"use strict";

const fetch = require("node-fetch");
const tools = require("./../../scripts/botTools.js");

const base = "https://e621.net/posts";
var lastFetch = 0;

const hardBlackList = 
[
	"",
	"cub",
	"young",
	"loli",
	"shota",
	"rape",
	"bestiality",
	"flash"
];

const fetchOptions =
{
	method: "get",
	headers:
	{
		"User-Agent": "Node-Synth/1.0 (by thealbinoarmadillo on e621)"
	}
};

async function run (message, options) {
		
	if (!message.channel.nsfw)
	{
		return "This command is only allowed in NSFW channels."
	}

	let url = `${base}.json?tags=${options.join("+")}${hardBlackList.join("+-")}`;
	url = encodeURI(url);

	if (lastFetch > Date.now() - 1500)
	{
		return "Try again in a moment.";
	}

	lastFetch = Date.now();

	let fetched = await fetch(url, fetchOptions);
	let json = await fetched.json();

	if (json.posts.length < 1)
	{
		return `No results found for:\n\`${options.join(" ")}\``;
	}

	let post = tools.randArray(json.posts);

	let isVid = false;
	let fileURL = post.file.url;
	if (post.file.url.endsWith(".webm") )
	{
		isVid = true;
		fileURL = post.sample.url;
	}

	let embed =
	{
		"color": 18838,
		"timestamp": post.created_at.substring(0, 23),
		"footer":
		{
		  "text": `${isVid? "📽️ ":""}Score: ${post.score.total} • ${post.tags.artist.join(" ")}`
		},
		"image":
		{
		  "url": fileURL
		},
		"author":
		{
		  "name": `Searched by ${message.author.username} • Post ${post.id}`,
		  "url": `${base}/${post.id}`,
		  "icon_url": message.author.avatarURL()
		},
		"description": options.join(" ")
	}

	message.client.botSend(message, {embed: embed}).then( (sent) =>
	{
		sent.react("🔁");
		let repeatcollector = sent.createReactionCollector( (reaction, user) => 
		{
			return reaction.emoji.name === "🔁" && !user.bot && user === message.author;

		}, {time: 3600000});

		repeatcollector.on("collect", (reaction, user) =>
		{
			run(message, options);
			repeatcollector.stop("complete");
		});

		repeatcollector.on("end", (collected, reason) =>
		{
			if (reason === "time") {
				sent.react("⏰");
			}
		});

		sent.react("💾");
		let savecollector = sent.createReactionCollector( (reaction, user) => 
		{
			return reaction.emoji.name === "💾" && !user.bot;

		}, {time: 3600000});
		
		savecollector.sentTo = [];
		savecollector.on("collect", (reaction, user) =>
		{
			if (savecollector.sentTo.includes(user.id) ) return;
			savecollector.sentTo.push(user.id);
			tools.botSendDM(user, sent.embeds[0]);
		});

		savecollector.on("end", (collected, reason) =>
		{
			if (reason === "time") {
				botReact(message, "⏰");
			}
		});
	});
}

module.exports =
{
	runFunction: run,
	calls: ["e621", "e6"],
        perms: []
};
