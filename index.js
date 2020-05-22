//"Import" Dependencies
const Discord = require("discord.js");
const ReadLine = require("readline");
const FileSystem = require("fs");
const MathJS = require("mathjs");
const request = require("request");
var TestRasPi = require('detect-rpi');

//Setup Discord Client
const Client = new Discord.Client();
const Token = 'NjYyODI1ODA2OTY3NDcyMTI4.Xqzm2Q.I2y50w7Nu5QmgMqamCI9a3VuxMc';
const Prefix = 'fg.';

//Client variables
var ClientLoggedIn = false;
var foodCommandList;
var commandCategoryList = new Array();
var lastCommandMessage;
var systemFilesPath = (TestRasPi() ) ? "/home/pi/furrieswithguns/Bot-FurGun/files/" : "files/";
var bandwagonCommandVar = { leader: undefined, limit: -1, members: [] };
var serverNameRegex = /([^\u0024\u0028-\u0029\u002E-\u0039\u0041-\u005A\u005F-\u007A\u00C0-00FF])/gi;

//Setup ReadLine Interface
const Interface = ReadLine.createInterface({
	input: process.stdin,
	output: process.stdout
});

//Setup Discord Client Events
Client.on("ready", () => { console.log("Client is ready\n"); ClientOnReady(); });
Client.on("message", message => { ClientOnMessage(message); });
Client.on("messageUpdate", (oldMessage, newMessage) => { ClientOnMessageUpdate(oldMessage, newMessage); });
Client.on("guildMemberAdd", member => {  });

//Setup Interface Events
Interface.on('line', (input) => { InterfaceOnLine(input); });

//Discord Called Events
function ClientOnReady () {	//Called when after Discord Client is logged in

	for (let i = 0, l = commandList.length; i < l; i++) {

		let cmdi = commandList[i];

		if (!cmdi.call) {
			cmdi.call = cmdi.name.toLowerCase().replace(/ /g, "");
		}

		if (cmdi.category == undefined) {
			cmdi.category = "unlisted";
		} else if (cmdi.category == "interactions" && cmdi.usage == undefined) {
			cmdi.usage = ["@User1","@User2","@User.."];
		}

		if (!commandCategoryList.includes(cmdi.category) ) {
			commandCategoryList.push(cmdi.category);
		}
	}

	foodCommandList = readJSON("foods");
}

function ClientOnMessage (message) {	//Called when the Client receives a message

	if (message.content.toLowerCase().indexOf(Prefix) == 0 && message.channel.guild) {
		
		if (message.author.bot) {
			console.log(`Bot (${message.author.username}) tried using a command:\n${message.content}\n`);
		} else {
			lastCommandMessage = message;
			runCommand(message);
		}
	}

	if (!message.author.bot) {
		let maa = message.attachments.array()[0];
		if (maa != undefined) {
			if (maa.width != undefined) {
				botReact(message, ":symbol_reddit_vote_up:680935204050698329");
				botReact(message, ":symbol_reddit_vote_down:680935348272103445");
			}
		}
	}
}

function ClientOnMessageUpdate (oldMessage, newMessage) {	//Called when the Client receives a message edit
	if (newMessage == newMessage.author.lastMessage) {
		ClientOnMessage(newMessage);
	}
}

//ReadLine Interface Called Events
function InterfaceOnLine (input) {	//Called when the console receives command line input

	if (input == "leave") {
		Disconnect();
	}
}

//Client logon functions
Connect(Token);
function Connect (token, seconds = 3) {

	if (ClientLoggedIn) return;
	console.log("\nAttempting to connect to Discord...\n");

	Client.login(Token).then(token => {
		console.log(`Logged in with token starting with: "${token.substring(0, 5)}"\n`);
		ClientLoggedIn = true;
	}).catch(error => {
		console.error(`Failed to connect to Discord:\n${error.message}\nTrying again in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);
		Client.setTimeout( () => {
			Connect(token, seconds);
		}, seconds * 1000);
	});
}

function Disconnect (message, seconds = 3) {

	console.log(`Disconnecting Client and ending nodeJS script in ${seconds} second${(seconds != 1) ? "s" : ""}...\n`);

	if (message != undefined) {
		botDelete(message);
	}

	Client.setTimeout( () => {
		Client.destroy();
		process.exit(621);
	}, seconds * 1000);
}

function Activity (type = "WATCHING", activity = `${Prefix}help`) {

	Client.user.setActivity(activity, { type: type }).then(presence => {
		console.log(`Activity set to "${presence.activities[0].name}".\n`);
	}).catch(error => {
		console.error(`Could not set activity:\n${error.message}\n`);
	});
}

//Client message functions
function botSend (channel, content) {	//Send a message to the specified channel

	if (typeof content == typeof "string") {
		if (content.trim() == "") {
			console.error("Message content is empty, this would fail. Did not send message.\n");
			return null;
		}
	}

	return channel.send(content).then(message => {
		console.log(`Sent to ${message.channel.name}(${message.channel.guild.name}):\n${message.content}`);
	}).catch(error => {
		console.error(`Error sending message:\n${error.message}\n`);
		botReact(lastCommandMessage, ":BOT_ERROR:712518336528777217");
	});
}

function botEdit (message, content, append = false) {	//Edit a specified message

	if (content.trim() == "") {
		console.error("Edit content is empty, this would fail. Did not edit message.\n");
		return null;
	}

	return message.edit(`${append ? message.content : content}${append ? content : ''}`).then(message => {
		console.log(`Edited message in ${message.channel.name}(${message.channel.guild.name}) to:\n${message.content}`);
	}).catch(error => {
		console.error(`Error editing message:\n${error.message}\n`);
	});
}

function botDelete (message) {	//Delete a specified message

	message.delete().then(message => {
		console.log(`Deleted message from ${message.author} in ${message.channel.name}(${message.channel.guild.name}):\n${message.content}`);
	}).catch(error => {
		console.error(`Error deleting message:\n${error.message}\n`);
	});
}

function botReact (message, emote) {
	message.react(emote).then( () => {
		console.log(`Reacted with ${emote} to:\n${message.content}\n`);
	}).catch(error => {
		console.error(`Failed to react to message:\n${error.message}\n`);
	});
}

function botSendDM (user, content) {	//Send a DM message to a user

	let name = user.username;

	if (user.dmChannel == undefined) {
		user.createDM().then(channel => {
			console.log(`Created a DM channel for ${name}`);
		}).catch(error => {
			console.error(`Error creating a DM channel for ${name}:\n${error.message}\n`);
		});

		botSendDM(user, content);
		return;
	}

	if (content.trim() == "") {
		console.error("DM content is empty, this would fail. Did not DM user.\n");
		return null;
	}

	user.dmChannel.send(content).then(message => {
		console.log(`Sent a DM to ${name}:\n${content}\n`);
	}).catch(error => {
		console.error(`Error sending a DM to ${name}${error.message}`);
	});
}

//Client misc. functions
function serverName (user, guild, bold = true, removeSpecial = true) {	//Get the server nickname of a user and clean it up

	if (guild == undefined) {
		console.error("A guild was not provided. Did not get server name of user.\n")
	}

	let name = guild.member(user).nickname;
	let regex = serverNameRegex;

	if (removeSpecial && name != null) {	//Remove emojis and symbol characters, uppercase the first letter
		name = name.replace(/[-_]/g,' ').replace(regex, '').trim();
		name = `${name[0].toUpperCase()}${name.substring(1)}`;

		if (name.length <= 1) {
			name = null;
		}
	}

	return `${bold ? "**" : ""}${name ? name : user.username}${bold ? "**" : ""}`;
}

function getMentionList (message, returnNames, removeSelf = true, removeBots = false) {	//Get all the user mentions in a message

	let mentions = message.mentions.users.array();

	for (let i = 0, l = mentions.length; i < l; i++) {	//Remove the user writing the message or any bots
		if ( (mentions[i] == message.author && removeSelf) || (mentions[i].bot && removeBots) ) {
			mentions.splice(i, 1);
		}
	}

	if (returnNames) {	//Turn mentions into server names
		for (let i = 0, l = mentions.length; i < l; i++) {
			mentions[i] = serverName(mentions[i], message.guild);
		}
	}

	return mentions;
}

function writeJSON (filename, object) {	//Write an object to a JSON file

	let string = JSON.stringify(object);

 	try {
		FileSystem.writeFileSync(`${systemFilesPath}${filename}.json`, string);
		console.log(`Wrote to "${filename}.json":\n${string}\n`);
	} catch (error) {
		console.error(`Failed to write to "${filename}.json":\n${error.message}\n`);
	}
}

function readJSON (filename) {	//Read an object from a JSON file

	let content;
	try {
		content = FileSystem.readFileSync(`${systemFilesPath}${filename}.json`);
		console.log(`Read from "${filename}.json":\n${(content.length > 100) ? `${content.toString().substring(0, 150)}...` : content}\n`);
	} catch (error) {
		console.error(`Failed to read from "${filename}.json":\n${error.message}\n`);
		return null;
	}

	return JSON.parse(content);
}

function arrayIntoList (array) {	//Turn an array into a human-readable list

	let l = array.length;

	if (l == 0) {
		return undefined;
	}

	let text = "";
	if (l <= 2) {
		text += (l == 2) ? `${array[0]} and ${array[1]}` : `${array[0]}`;
	} else {
		for (let i = 0; i < l; i++) {
			text += `${(i == l - 1) ? " and " : ""}${array[i]}${(i < l - 2) ? ", " : ""}`;
		}
	}

	return text;
}

function randArray (array) {	//Randomly pick from an array
	let pick = Math.floor(Math.random() * array.length);
	return array[pick];
}

function helpCommand (message, args) {

	let embed = new Discord.MessageEmbed()
	.setThumbnail(Client.user.avatarURL() )
	.setColor("64BF51")
	.setFooter("This bot is a WIP by TheAlbinoDillo");

	if (args[1] != undefined) {

		if (commandCategoryList.includes(args[1]) ) {
			for (let i = 0, l = commandList.length; i < l; i++) {
				if (commandList[i].category == args[1]) {
					embed.setTitle(`Command category: ${args[1]}`)
					.addField(`**${commandList[i].name}**${commandList[i].onlyOwner ? "®" : ""}\n${commandList[i].desc}`,`${Prefix}${commandList[i].call} ${usageList(commandList[i])}`);
				}
			}
			botSend(message.channel, embed);
			return;
		}

		let selected = -1;
		for (let i = 0, l = commandList.length; i < l; i++) {
			if (commandList[i].call == args[1]) {
				selected = i;
			}
		}

		if (selected > -1) {
			
			let cls = commandList[selected];
			embed.setTitle(`Command: ${cls.name} ${cls.onlyOwner ? "[Restricted]" : ""}`)
			.addField(cls.desc, `${Prefix}${cls.call} ${usageList(cls)}`);
			botSend(message.channel, embed);
	
			return;
		}
	}


	embed.setTitle(`${Client.user.username} commands list`);

	for (let i = 0; i < commandCategoryList.length; i++) {
		if (commandCategoryList[i] == "unlisted") continue;
		embed.addField(`${commandCategoryList[i]}`,`${Prefix}help ${commandCategoryList[i]}`);
	}

	botSend(message.channel, embed);
}

function usageList (command) {

	if (command.usage == undefined) {
		return "";
	}

	let list = new Array();

	for (let i = 0, l = command.usage.length; i < l; i++) {

		list[i] = ` <${command.usage[i]}>`;
	}

	return list;
}

function runCommand (message) {

	message.channel.startTyping();

	var text = message.content;
	var args = text.substring(Prefix.length).split(" ");

	console.log(`\nCommand detected from ${message.author.username} in ${message.channel.name} at ${new Date(message.createdTimestamp)} :\n${text}`);

	var didAnything = false;
	for (var i = 0; i < commandList.length; i++) {
		if (args[0].toLowerCase() == commandList[i].call && !didAnything) {
			didAnything = true;

			if ( (commandList[i].onlyOwner && message.author == message.guild.owner.user) || !commandList[i].onlyOwner) {
				try {
					commandList[i].run(message, args);
					console.log("Ran command successfully");
				} catch (error) {
					botSend(message.channel, "Command Failed.");
					console.log(error.message);
				}
	
				if (commandList[i].delmsg) {
					message.delete();
				}
			} else {
				botSend(message.channel, "This command can only be used by the owner.");
			}
		}
	}

	if (!didAnything) {
		botSend(message.channel, `**${Prefix + args[0]}** is not a command. Use **${Prefix}help** for avalible commands.`);
	}

	message.channel.stopTyping();
}

const commandList =
[
	// {
	// 	call: "cmd",
	// 	name: "Command",
	// 	desc: "Description",
	// 	category: "category",
	// 	usage: [command usage],
	// 	delmsg: true/false,
	//	onlyOwner: true/false,
	// 	runInDM: true/false,
	// 	run: function
	// }

	{//Help
		name: "Help",
		desc: "Get help",
		runInDM: false,
		run: helpCommand
	},

	{//Server Info	
		call: "serverinfo",
		name: "Server Information",
		desc: "Get information about the server.",
		category: "tools",
		run: function (message, args) {
			let g = message.guild;
			let url = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;

			let embed = new Discord.MessageEmbed()
			.setTitle(`Information for ${g.name}`)
			.setThumbnail(url)
			.addField("Server Owner:", serverName(g.owner.user, g), true)
			.addField("Created On:", `${g.createdAt.toLocaleString('default',{month:'long'})} ${g.createdAt.getFullYear()}`, true)
			.addField("Member Count:", `${g.memberCount} users`, true)
			.setFooter(`${g.region} • ${g.id} • ${g.owner.user.username}#${g.owner.user.discriminator}`);

			botSend(message.channel, embed);
		}
	},

	{//Marco
		name: "Marco",
		desc: "Ping a simple responce from the bot",
		category: "tools",
		run: function (message, args) {
			let pingTime = message.createdTimestamp;
			message.channel.send("Polo").then(msg => {
				botEdit(msg, `**Polo** \`${(msg.createdTimestamp - pingTime)} ms\``);
			}).catch(error => {
				console.error(`Error sending marcopolo message:\n${error.message}\n`);
			});
		}
	},

	{//Echo
		name: "Echo",
		desc: "Make the bot say what you say",
		category: "tools",
		usage: ["text"],
		delmsg: true,
		run: function (message, args) {
			let content = message.content.substring(Prefix.length).substring(this.call.length);
			botSend(message.channel, content);

			let lastEcho = new Object();
			lastEcho.userid = message.author.id;
			lastEcho.content = content;

			writeJSON("lastEcho", lastEcho);
		}
	},

	{//Inspect
		name: "Inspect",
		desc: "Inspect the last echo command",
		category: "tools",
		run: function (message, args) {
			let lastEcho = readJSON("lastEcho");

			let user = message.guild.members.cache.get(lastEcho.userid);
			botSend(message.channel, `Uh oh, <@${lastEcho.userid}>! You got caught!\n**${serverName(user, message.guild)}** made me say \`${lastEcho.content.substring(1)}\``);
		}
	},

	{//Decide
		name: "Decide",
		desc: "Randomly decide from values",
		category: "tools",
		usage: ["option1","option2","option.."],
		runInDM: true,
		run: function (message, args) {

			let arr = args.slice();
			arr.shift();
			let pick = Math.floor(Math.random() * arr.length);
			let text = `Deciding from:\n${arrayIntoList(arr)}\nWinner is: **${arr[pick]}**`;
			botSend(message.channel, text);
		},

	},

	{//Welcome
		name: "Welcome",
		desc: "Welcomes a new member to the server",
		category: "tools",
		delmsg: true,
		run: function (message, args) {
			botSend(message.channel, `**Welcome to ${message.guild.name}!**\n Head on over to <#680991136378257433> to set yourself some tags, and <#685622079843860494> to ask for a custom role!`);
		}
	},

	{//Fezzy
		name: "Fezzy",
		desc: "Just posts a Sly Sabrina emote, heh.",
		category: "fun",
		run: function (message, args) {
			let url = "files/fezzy.png";
			botSend(message.channel, {files: [url]});
		}
	},

	{//Party
		name: "Party",
		desc: "It's a party! Let's groove!",
		category: "fun",
		run: function (message, args) {
			let url = "files/protoParty.gif";
			botSend(message.channel, {files: [url]});
		}
	},

	{//Dance
		name: "Dance",
		desc: "Let's dance!",
		category: "fun",
		run: function (message, args) {

			let pick = new Array();
			let pickLength = FileSystem.readdirSync("files/dance/").length;

			for (let i = 0, l = pickLength; i < l; i++) {
				pick[i] = `${i}`;
			}

			let url = `files/dance/dance${randArray(pick)}.gif`;
			botSend(message.channel, {files: [url]});
		}
	},

	{//Hug
		name: "Hug",
		desc: "Give someone a hug!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "themselves";
			let picks = ["gives a hug to","gives a warm hug to","gives a tight hug to","wraps their arms around","embraces","warmly embraces","tightly embraces"];

			let text = `${serverName(message.author, message.guild)} ${randArray(picks)} ${arr}! <:GrantHug:704495124595474452>`;
			botSend(message.channel, text);
		}
	},

	{//Nuzzle
		name: "Nuzzle",
		desc: "Give someone a comfy nuzzling!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "themselves";
			let picks1 = ["warmly","comfily","cozily"];
			let picks2 = [" ", " into "];

			let text = `${serverName(message.author, message.guild)} ${randArray(picks1)} nuzzles${randArray(picks2)}${arr}! <:GrantLove:704495125669216338>`;
			botSend(message.channel, text);
		}
	},

	{//Pet
		name: "Pet",
		desc: "Give someone some nice pets!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} gives some soft pets to ${arr}!`;
			botSend(message.channel, text);
		}
	},

	{//Cuddle
		name: "Cuddle",
		desc: "Give someone cuddly cuddles!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "themselves";
			let picks1 = ["","warmly ","softly ","gently ","happily "];
			let picks2 = ["","with ","next to "];

			let text = `${serverName(message.author, message.guild)} ${randArray(picks1)}cuddles ${randArray(picks2)}${arr}!`;
			botSend(message.channel, text);
		}
	},

	{//Kiss
		name: "Kiss",
		desc: "Give someone a sloppy kiss!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} gives ${arr} a big kiss! <:GrantBlush:704495120514285641>`;
			botSend(message.channel, text);
		}
	},

	{//Spank
		name: "Spank",
		desc: "Give someone a spank on the butt!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} spanks ${arr} on the booty! <:GrantButt:708868787478200370> 👋`;
			botSend(message.channel, text);
		}
	},

	{//Ruffle
		name: "Ruffle",
		desc: "Ruffle up those feathery friends!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "their own";

			let text = `${serverName(message.author, message.guild)} ruffles ${arr}${(arr == "themselves") ? "" : "'s"} feathers!"`;
			botSend(message.channel, text);
		}
	},

	{//Boop
		name: "Boop",
		desc: "Boop 'em on the snoot!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "their own";
			let text = `${serverName(message.author, message.guild)} boops ${arr}${(arr == "themselves") ? "" : "'s"} snoot! <:symbol_boop:692040846547091507>`;
			botSend(message.channel, text);
		}
	},

	{//Feed
		name: "Feed",
		desc: "Feed your friends some yummy food!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} feeds ${arr} ${randArray(foodCommandList.foodlist)}`;
			botSend(message.channel, text);
		}
	},

	{//Bonk
		name: "Bonk",
		desc: "Give someone a bonk on the head!",
		category: "interactions",
		run: function (message, args) {
			let arr = arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} bonks ${arr} on the head!`;
			botSend(message.channel, text);
		}
	},

	{//Add Food
		name: "Add Food",
		desc: "Add a food to the food list!",
		usage: ["food"],
		onlyOwner: true,
		run: function (message, args) {
			let content = message.content.substring(Prefix.length).substring(this.call.length + 1);

			foodCommandList.foodlist.unshift(content);
			writeJSON("foods", foodCommandList);

			botSend(message.channel, `\`${content}\` has been added to the food list.`)
		}
	},

	{//Remove last food
		name: "Remove Last Food",
		desc: "Remove the last food added to the list!",
		onlyOwner: true,
		run: function (message, args) {

			let removed = foodCommandList.foodlist.shift();
			writeJSON("foods", foodCommandList);

			botSend(message.channel, `Removed \`${removed}\` from the food list.`);
		}
	},

	{//Seen
		call: "seen",
		name: "Last Seen",
		desc: "Get the last time the user has sent a message.",
		category: "tools",
		usage: ["@user"],
		run: function (message, args) {
			let mention = getMentionList(message, false, false, false)[0];

			let time = new Date(message.createdTimestamp);
			let day = time.getDate();
			let month = time.toLocaleString('default',{month:'long'});
			let year = time.getFullYear();

			botSend(message.channel, `**${serverName(mention, message.guild)}** was last seen ${month}, ${day} ${year}`);
		}
	},

	{//Band
		call: "band",
		name: "Band Wagon",
		desc: "Join the band wagon!",
		category: "tools",
		onlyOwner: true,
		usage: ["# | raffle | raffle- | pick"],
		run: function (message, args) {

			if (message.author != bandwagonCommandVar.leader && bandwagonCommandVar.limit > 0 && bandwagonCommandVar.limit - bandwagonCommandVar.members.length <= 0) {
				botSend(message.channel, `Sorry ${serverName(message.author, message.guild)}, the band wagon is full.`);
				return;
			}

			if (bandwagonCommandVar.members.length > 0) {
				if (message.author == bandwagonCommandVar.leader) {

					if (args[1] == "raffle" || args[1] == "raffle-") {
						var pick = Math.floor(Math.random() * bandwagonCommandVar.members.length);

						if (bandwagonCommandVar.members.length <= 1) {
							botSend(message.channel, "Wait for members before starting a raffle!");
							return;
						}

						while (bandwagonCommandVar.members[pick] == bandwagonCommandVar.leader) {
							pick = Math.floor(Math.random() * bandwagonCommandVar.members.length);
						}

						var end = "!";
						if (args[1] == "raffle-") {
							bandwagonCommandVar.members.splice(pick, 1);
							end = " and was removed!"
						}

						botSend(message.channel, `<@${bandwagonCommandVar.members[pick].id}> won the raffle ${end}`);
						return;
					}
					if (args[1] == "pick") {
						var pick = Math.floor(Math.random() * bandwagonCommandVar.members.length);
						botSend(message.channel, `<@${bandwagonCommandVar.members[pick].id}> got picked!`);
						return;
					}

					bandwagonCommandVar.limit = -1;
					bandwagonCommandVar.members = [];
					botSend(message.channel, `${serverName(message.author, message.guild)} has ended the band wagon.`);
					return;
				} else {
					for (var i = 0; i < bandwagonCommandVar.members.length; i++) {
						if (bandwagonCommandVar.members[i] == message.author) {
							bandwagonCommandVar.members.splice(i, 1);
							botSend(message.channel, `${serverName(message.author, message.guild)} has left the band wagon.`);
							return;
						}
					}
				}
			}

			if (bandwagonCommandVar.members.length == 0) {
				bandwagonCommandVar.members.push(message.author);
				bandwagonCommandVar.leader = message.author;

				if (Math.abs(parseInt(args[1]) ) > 1) {
					bandwagonCommandVar.limit = Math.abs(parseInt(args[1]) );
				}

				botSend(message.channel, `${serverName(message.author, message.guild)} has started a band wagon.\nUse **${Prefix}${this.call}** to join!`);
				if (bandwagonCommandVar.limit > 0) {
					botSend(message.channel, `${bandwagonCommandVar.limit - bandwagonCommandVar.members.length} members remaining.`)
				}
			} else {
				bandwagonCommandVar.members.push(message.author);
				var names = [];
				for (var i = 0; i < bandwagonCommandVar.members.length; i++) {
					names[i] = serverName(bandwagonCommandVar.members[i], message.guild);
				}
				botSend(message.channel, `${serverName(message.author, message.guild)} has joined the band wagon.\n${arrayIntoList(names)} are in the band wagon!`);
				if (bandwagonCommandVar.limit > 0) {
					botSend(message.channel, `${bandwagonCommandVar.limit - bandwagonCommandVar.members.length} members remaining.`)
				}
			}
		}
	},

	{//Leave
		name: "Leave",
		desc: "Disconnect the bot.",
		delmsg: true,
		onlyOwner: true,
		run: Disconnect
	},

	{//Am I Cute
		name: "Am I cute",
		desc: "Let the bot determine if you are a cutie",
		category: "fun",
		run: function (message, args) {
			let picks = ["Yes!","Yes.","Of course!","All the time!","Without a doubt!","100% of the time!","Only on days that end in \"Y\"","Si","💯","Absolutely!","Yup!","Sure are!","Totes.","Totally!","Definitely!","Certainly!","Undoubtedly!","Only if ```(true != false)```"];
			botSend(message.channel, randArray(picks) );
		}
	},

	{
		call: "calc",
		name: "Calculator",
		desc: "Enslave the bot to do math!",
		category: "tools",
		usage: ["For help see the [MathJS Syntax Page](https://mathjs.org/docs/expressions/syntax.html)"],
		run: function (message, args) {
			let exp = message.content.substring(Prefix.length + args[0].length);

			var text = "";
			try {
				text = MathJS.evaluate(exp).toString();
			} catch (error) {
				text = error.message;
			}

			botSend(message.channel, text);
		}
	},

	{
		name: "Test Error",
		desc: "See if the error emote works",
		run: function (message, args) {
			let text = "";

			for (let i = 0; i <= 2000; i++) {
				text = `${text}e`;
			}

			botSend(message.channel, text);
		}
	},

	{
		call: "hex",
		name: "Hex Color",
		desc: "Get a hex color from the bot.",
		category: "tools",
		usage: ["hex code"],
		run: function (message, args) {
			
			let hex = args[1].replace(/[^a-f0-9]/gi, '').trim();

			if (hex.length != 6) {
				botSend(message.channel, "Not a valid hex code. (**#**ABC123)");
				return;
			}

			let url = `https://www.thecolorapi.com/id?hex=${hex}`;
			request({
				url: url, json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					let embed = new Discord.MessageEmbed()
					.addField(`\n${body.hex.value}`, body.name.value)
					.setThumbnail(`http://via.placeholder.com/50/${body.hex.clean}/${body.hex.clean}`);
					botSend(message.channel, embed);
				}
			});
		}
	}
];