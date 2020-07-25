"use strict";

class Responce {
	constructor(type = "text", content, guild, channel, message) {
		let types = ["text", "edit", "react", "ping", "transpose"];
		if (!types.includes(type) ) {
			console.error("Responce type not valid.\n");
			return null;
		}

		this.type = type,
		this.content = content,
		this.guild = guild,
		this.channel = channel,
		this.message = message
	}
}

class TextMessage extends Responce {
	constructor(message, content) {
		super
		(
			"text",
			content,
			message.guild,
			message.channel,
			message
		);
	}
}

class Transpose extends Responce {
	constructor(content, guild, channel) {
		super
		(
			"transpose",
			content,
			guild,
			channel,
			null
		);
	}
}

class PingMessage extends Responce {
	constructor(message, content) {
		super
		(
			"ping",
			content,
			message.guild,
			message.channel,
			message
		);
	}
}

class ReactEmote extends Responce {
	constructor(message, emote) {
		super
		(
			"react",
			emote,
			message.guild,
			message.channel,
			message
		);
	}
}

class Command {
	constructor(name, runFunction = function () {}, description = "", category, usage = [], deleteMessage = false, permissions = [], calls = []) {
		this.name = name;
		this.runFunction = runFunction;
		this.description = description;
		this.category = category;
		this.usage = usage;
		this.deleteMessage = deleteMessage;
		this.permissions = permissions;
		this.calls = calls;
	}
}

module.exports =
{
	Command: Command,
	Responce: Responce,
	TextMessage: TextMessage,
	Transpose: Transpose,
	PingMessage: PingMessage,
	ReactEmote: ReactEmote
};