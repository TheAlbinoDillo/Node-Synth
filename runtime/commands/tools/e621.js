"use strict";

const Discord = require("discord.js");
const Fetch = require("node-fetch");

const base = "https://e621.net/posts";

var last_fetch = Date.now();
const wait_seconds = 2;

const hard_blacklist = 
[
	"",
	"cub",
	"young",
	"loli",
	"shota",
	"rape",
	"bestiality",
	"flash",
	"human"
];

const fetch_options =
{
	method: "get",
	headers:
	{
		"User-Agent": "Node-Synth/1.0 (by TheAlbinoArmadillo on e621)"
	}
};

async function get_posts (tags)
{
	let url = `${base}.json?tags=${tags.join("+")}${hard_blacklist.join("+-")}`;
	url = encodeURI(url);

	let fetched = await Fetch(url, fetch_options);
	let json = await fetched.json();

	return json;
}

async function send_embed (options, posts_json)
{
	options.channel.startTyping();

	let post = BotTools.randArray(posts_json.posts);
	let is_vid = false;
	let file_url = post.file.url;
	if (post.file.url.endsWith(".webm") )
	{
		is_vid = true;
		file_url = post.sample.url;
	}

	let embed = new Discord.MessageEmbed()
	.setColor(18838)
	.setTimestamp(post.created_at.substring(0, 23) )
	.setFooter(`${is_vid? "📽️ ":""}Score: ${post.score.total} • ${post.tags.artist.join(" ")}`)
	.setImage(file_url)
	.setAuthor
	(
		`Searched by ${options.author.username} • Post ${post.id}`,
		options.author.avatarURL(),
		`${base}/${post.id}`

	).setDescription(options.full);

	let sent = await BotActions.send(options, embed);

	options.channel.stopTyping();
}

async function run (options) {
		
	//Fail if no tags were given
	if (!options.full)
	{
		let msg = "No tags were provided.";
		BotActions.react_say(options.message, "❕", msg);
		return;
	}

	if (last_fetch > Date.now() - (wait_seconds * 1000) )
	{
		let msg = "Please wait before using this command again.";
		BotActions.react_say(options.message, "⌛", msg);
		return;
	}

	last_fetch = Date.now();

	let json = await get_posts(options.args);

	if (json.posts.length === 0)
	{
		let msg = `No results found for:\n\`${options.full}\``;
		BotActions.send(options, msg);
		return;
	}

	send_embed(options, json);

	return;
	//////////////////////////////////////////////////////////

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
	name: "E621",
	run: run,
	nsfw: true,
	perms: [],
	calls: ["e621", "e6"]
};