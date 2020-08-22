"use strict";

const discord = require("discord.js");
const index = root_require("index.js");

class BotActions
{
	static async send (options, content)
	{	
		let channel = options.channel;
		let message = options.message;

		if (!(channel instanceof discord.TextChannel) )
		{
			console.error("Did not provide a channel to botSend.\n");
			return null;
		}
	
		if (typeof content === 'string' || content instanceof String)
		{
			if (content.trim() == "")
			{
				console.error("Message content is empty, this would fail. Did not send message.\n");
				return null;
			}
			else if (content.length > 2000)
			{
				console.error("Message content exceeds 2000 characters, this would fail. Did not send message.\n");
				return null;
			}
		}
	
		let sent = await channel.send(content).catch(error =>
		{
			console.error(`Error sending message:\n${error.message}\n`);
			if (message)
			{
				this.react_say(message, "‼️", `\`${message.content}\`\nMessage error: ${error.message}`);
			}
		});
		return sent;
	}

	static async react (message, emote)
	{
		message.react(emote).catch(error =>
		{
			console.error(`Failed to react to message:\n\t${error.message}\n`);
		});
	}

	static async react_say (message, emote, content)
	{
		await this.react(message, emote);

		let collector = message.createReactionCollector( (reaction, user) =>
		{
			if (reaction.emoji.name !== emote) return false;
			if (user !== message.author) return false;
			return true;

		}, 120000);

		collector.on("collect", (reaction) =>
		{
			collector.stop("complete");

			let options =
			{
				message: message,
				channel: message.channel
			};

			this.send(options, content);
		});

		collector.on("end", (collected, reason) =>
		{
			if (reason === "time") this.react(message, "⏰");
		});
	}
}

module.exports = BotActions;