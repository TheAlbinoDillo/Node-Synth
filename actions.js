"use strict";

const Discord = require("discord.js");
const Index = root_require("index.js");

class BotActions
{
	static async send (options, content)
	{	
		let channel = options.channel;
		let message = options.message;

		let text = channel instanceof Discord.TextChannel;
		let dm = channel instanceof Discord.DMChannel;

		if (!(text || dm) )
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

	static async send_dm (options, user, content)
	{
		let dm;
		if (!user.dmChannel)
		{
			dm = await user.createDM().catch( (error)=>
			{
				this.react_say(options.message, "‼️", `Error creating DM.`);
			});
		}

		if (!dm) return;

		let dm_options =
		{
			channel: user.dmChannel,
			message: options.message
		};
		this.send(dm_options, content);
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
		let dofunc = () =>
		{
			let options =
			{
				message: message,
				channel: message.channel
			};

			this.send(options, content);
		};
		return this.react_do(message, emote, dofunc);
	}

	static react_collect (message, filter, on_collect, on_end, time = 120000)
	{
		let collector = message.createReactionCollector(filter, time);

		let time_end = (collected, reason) =>
		{
			if (reason === "time") this.react(message, "⏰");
		};

		collector.on("collect", on_collect);
		collector.on("end", on_end || time_end);

		return collector;
	}

	static async react_do (message, emote, dofunc)
	{
		await this.react(message, emote);

		let collector = message.createReactionCollector( (reaction, user) =>
		{
			let a = reaction.emoji.name === emote;
			let b = user === message.author || user.id === Index.client_settings.owner;
			let c = !user.bot;
			return a && b && c;

		}, 120000);

		collector.on("collect", (reaction, user) =>
		{
			collector.stop("complete");

			dofunc(reaction, user);
		});

		collector.on("end", (collected, reason) =>
		{
			if (reason === "time") this.react(message, "⏰");
		});

		return collector;
	}
}

module.exports = BotActions;