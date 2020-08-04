const fetch = require("node-fetch");

function run (message, args) {
	fetch("https://e926.net/posts.json?limit=1tags=order%3Arandom+red_panda",
	{
		method: "get",
		headers:
		{
			'User-Agent': "Node-Synth/1.0 (by thealbinoarmadillo on e621)"
		}
	}).then(result => result.json() ).then(json => message.channel.send(json.posts[0].file.url) );
}

module.exports =
{
	runFunction:run,
	permissions:["BOT_OWNER"],
	calls:["e926", "e9"]
};