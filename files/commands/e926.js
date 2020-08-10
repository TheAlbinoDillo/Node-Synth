const fetch = require("node-fetch");

function run (message, options) {

        //if (!message.channel.nsfw) return "NSFW only";
        
        let base = "https://e926.net/posts.json?tags=";
        let url = base + options.join("+");
        url = encodeURI(url);

	fetch(url,
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
