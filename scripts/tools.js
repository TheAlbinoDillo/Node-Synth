"use strict";

//Import libraries
//////////////////////////////////////////////////////////////////////////////////
const fs = require("fs");

//Tools class
//////////////////////////////////////////////////////////////////////////////////
class BotTools
{
	static upperFirst (string)
	{
		return string[0].toUpperCase() + string.substring(1);
	}
	
	static subEnd (string, count)
	{
		return string.substring(0, string.length - count);
	}
	
	static list_dir (path)
	{
		let dir = fs.readdirSync(path);
	
		let contents =
		{
			files: [],
			folders: []
		};
	
		dir.forEach( async (element) =>
		{
			let subpath = `${path}/${element}`;
			let stat = fs.lstatSync(subpath);
	
			let obj =
			{
				filename: element,
				path: subpath,
				path_up: path
			};
	
			if (stat.isDirectory() )
			{
				contents.folders.push(obj);
				return;
			}
			if (stat.isFile() )
			{
				contents.files.push(obj);
				return;
			}
		});
		return contents;
	}
	
	static load_file (path)
	{
		return fs.readFileSync(path);
	}

	static load_json (path)
	{
		return JSON.parse(this.load_file(path) );
	}
	
	static async send (options, content)
	{
		let channel = options.channel;
		let message = options.message;

		if (!(channel instanceof discord.TextChannel) ) {
			console.error("Did not provide a channel to botSend.\n");
			return null;
		}
	
		if (typeof content === 'string' || content instanceof String) {
			if (content.trim() == "") {
				console.error("Message content is empty, this would fail. Did not send message.\n");
				return null;
			} else if (content.length > 2000) {
				console.error("Message content exceeds 2000 characters, this would fail. Did not send message.\n");
				return null;
			}
		}
	
		let sent = channel.send(content);
	
		sent.then(message => {}).catch(error =>
		{
			console.error(`Error sending message:\n${error.message}\n`);
			if (message) {
				errorReact(message, "‼️", `\`${message.content}\`\nMessage error: ${error.message}`);
			}
		});
	
		return sent;
	}
	
	static rand_number (max, min = 0)
	{
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
	
	static rand_array (array)
	{
		let pick = this.rand_number(array.length - 1);
		return array[pick];
	}

	static pick_from (value)
	{
		if (typeof value === 'string' || value instanceof String)
		{
			return value;
		}
			
		let choice = Math.floor(Math.random() * value.length);
			
		return this.pick_from(value[choice]);	
	}

	static json_script (replacements, script)
	{
		let array = script.slice();
		let string = "";

		array.forEach( (element) =>
		{
			string += this.pick_from(element);
		});
			
		for (let replace in replacements)
		{
			string = string.replace(`%${replace}%`, replacements[replace]);
		}
		return string;
	}

	static bold (text)
	{
		return `**${text}**`;
	}

	static array_list (array, join_word = "and")
	{
		let length = array.length;
		if (length === 1)
		{
			return array[0];
		}
		else
		{
			let without_two = array.slice(0, length - 2);
			return `${without_two.join(", ")}, ${array[length - 2]} ${join_word} ${array[length - 1]}`;
		}
	}

	static get_mentions (options, remove_self = true, remove_bot = true)
	{
		let members = options.message.mentions.members.array();

		if (members.length === 0) return;

		if (remove_self)
		{
			members = members.filter( (a) =>
			{
				return a !== options.member;
			});
		}
		if (remove_bot)
		{
			members = members.filter( (a) =>
			{
				return !a.user.bot;
			});
		}
		return members;
	}

	static clean (string)
	{
		let replacements = ["*", "\\", "_", "~", ":", "#"];
		replacements.forEach( (e) =>
		{
			string = string.replace(e, `\\${e}`);
		});

		string = string.replace("@everyone", "@\u200beveryone");
		string = string.replace("<@", "<\u200b@");

		return string;
	}
}

//Export class
module.exports = BotTools;