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
	
	static async send (channel)
	{
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

	static json_script (json_obj)
	{
		let output = "";

		json_obj.forEach( (element) =>
		{
			let complete;

			if (Array.isArray(element) )
			{
				complete = this.json_script(element);
			}
			output += complete;
		});

		return output;
	}
}

//Export class
module.exports = BotTools;