"use strict";

const fetch = require("node-fetch");
const tools = require("./../scripts/botTools.js");

const base = "https://e926.net/posts";
var lastFetch = 0;

function run (message, options) {

	let url = `${base}.json?tags=${options.join("+")}`;
	url = encodeURI(url);

	if (lastFetch > Date.now() - 1500)
	{
		return "Try again in a moment.";
	}

	lastFetch = Date.now();

	fetch(url,
	{
		method: "get",
		headers:
		{
			'User-Agent': "Node-Synth/1.0 (by thealbinoarmadillo on e621)"
		}
	}).then( (result) =>
	{
		return result.json();

	}).then( (json) =>
	{
		if (json.posts.length < 1)
		{
			message.channel.send(`No results found for:\n\`${options.join(" ")}\``);
			return;
		}

		message.channel.send(eEmbed(base, json, message.author, options) );
	});
}

function eEmbed (baseURL, json, user, tags)
{
	let post = tools.randArray(json.posts);

	let embed =
	{
	  "embed": {
	    "color": 18838,
	    "timestamp": post.created_at.substring(0, 23),
	    "footer": {
	      "text": `Score: ${post.score.total} • ${post.tags.artist.join(" ")}`
	    },
	    "image": {
	      "url": post.file.url
	    },
	    "author": {
	      "name": `${user}: ${tags.join(" ")}`,
	      "url": `${baseURL}/${post.id}`,
	      "icon_url": user.avatarURL()
	    }
	  }
	}
	return embed;
}

module.exports =
{
	runFunction:run,
	calls:["e926", "e9"]
};
