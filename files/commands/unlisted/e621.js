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



	return eEmbed(base, json, message.author, options).then();
/*
		message.channel.send(eEmbed(base, json, message.author, options) ).then( (sent) =>
		{
			sent.react("💾");
			let collector = sent.createReactionCollector( (reaction, user) => 
				{
					return reaction.emoji.name === "💾" && !user.bot;

				}, {time: 3600000});
		
			collector.sentTo = [];
			collector.on("collect", (reaction, user) =>
				{
					if (collector.sentTo.includes(user.id) ) return;

					collector.sentTo.push(user.id);

					tools.botSendDM(user, sent.embeds[0]);
				}
			);
			
			collector.on("end", (collected, reason) =>
				{
					if (reason == "time") {
						botReact(message, "⏰");
					}
				}
			);
		});
	});*/
}

function eEmbed (baseURL, json, user, tags)
{
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
	  "embed": {
	    "color": 18838,
	    "timestamp": post.created_at.substring(0, 23),
	    "footer": {
	      "text": `${isVid? "📽️ ":""}Score: ${post.score.total} • ${post.tags.artist.join(" ")}`
	    },
	    "image": {
	      "url": fileURL
	    },
	    "author": {
	      "name": `${user.username}`,
	      "url": `${baseURL}/${post.id}`,
	      "icon_url": user.avatarURL()
	    },
	    "description": tags.join(" ")
	  }
	}
	return embed;
}

module.exports =
{
	runFunction: run,
	calls: ["e621", "e6"]
};