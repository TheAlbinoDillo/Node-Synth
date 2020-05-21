// const Discord = require('discord.js');
// const readline = require('readline');
// const fs = require("fs");
// const Client = new Discord.Client();
// const token = 'NjYyODI1ODA2OTY3NDcyMTI4.Xqzm2Q.I2y50w7Nu5QmgMqamCI9a3VuxMc';

// var prefix = 'fg.';
var logging = false;
var requestDestroy = false;
var onlyme = false;
var pingTime = 0;
//var foods;
//var categoryList = new Array();
var bandwagon =
	{
		leader: undefined,
		limit: -1,
		members: []
	};

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

function commands (message) {

	message.channel.startTyping();

	var text = message.content;
	var args = text.substring(prefix.length).split(" ");

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
					botSend(message, "Command Failed.");
					console.log(error);
				}
	
				if (commandList[i].delmsg) {
					message.delete();
				}
			} else {
				botSend(message, "This command can only be used by the owner.");
			}
		}
	}

	if (!didAnything) {
		botSend(message, `**${prefix + args[0]}** is not a command. Use **${prefix}help** for avalible commands.`);
	}

	if (requestDestroy) {
		leave(message);
	}

	message.channel.stopTyping();
}

// function botSend(message, content) {
	
// 	return message.channel.send(content)
// 	.then(console.log("Sent to " + message.channel.name + " in " + message.guild.name + ":\n" + content) )
// 	.catch(error =>
// 		{	
// 			console.log(error + "\n");
// 			message.channel.send("Message Error.");
// 		}
// 	);
// }

// function botEdit (message, content, addToLast = false) {
// 	if (addToLast) {
// 		return message.edit(message.content + content);
// 	} else {
// 		return message.edit(content);
// 	}
// }

// Client.on('ready', () =>
// 	{
// 		console.log("Logged in!\n");

// 		for (var i = 0; i < commandList.length; i++) {

// 			if (!commandList[i].call) {
// 				commandList[i].call = commandList[i].name.toLowerCase().replace(/ /g, "");
// 			}

// 			if (commandList[i].category == "interactions" && commandList[i].usage == undefined) {
// 				commandList[i].usage = ["@User1","@User2","@User.."];
// 			}
// 		}

// 		foods = readJSON("foods");

// 		for (var i = 0; i < commandList.length; i++) {
// 			if (commandList[i].category == undefined) {
// 				commandList[i].category = "unlisted";
// 			}

// 			if (!categoryList.includes(commandList[i].category) ) {
// 				categoryList.push(commandList[i].category);

// 			}
// 		}

// 		Client.user.setActivity(prefix + 'help', { type: 'WATCHING' })
//   		.then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
//   		.catch(console.error);
// 	}
// );

// Client.on('message', message =>
// {
// 	if (!message.channel.guild) return;

// 	if (message.content.toLowerCase().indexOf(prefix) == 0) {
		
// 			//We need perms!!!

// 		if (!message.author.bot) {
// 			if (message.author == message.guild.owner.user || !onlyme) {
// 				commands(message);
// 			} else {
// 				botSend(message, "Grant disabled the commands for testing.");
// 			}
// 		} else {
// 			console.log("Bot tried using a command");
// 		}
// 	}
// });

//Client.on('messageUpdate', (oldMessage, newMessage) =>{}

// loginRoutine(3);
// function loginRoutine (loginTimer) {

// 	if (Client.loggedIn) {
// 		return;
// 	}

// 	console.log("Attempting login.");
// 	Client.setTimeout(function()
// 		{
// 			if (!Client.loggedIn) {
// 				loginRoutine(loginTimer);
// 			}

// 		}, loginTimer * 1000);
// 	Client.login(token).then(Client.loggedIn = true).catch(error =>
// 		{
// 			console.log(`Couldn't log in:\n${error}\nTrying again in ${loginTimer} seconds.\n`);
// 			Client.setTimeout(function() { loginRoutine(loginTimer) }, loginTimer * 1000);
// 		}
// 	);
// }

// function writeJSON (filename, object) {

// 	var string = JSON.stringify(object);
 	
//  	fs.writeFile("files/" + filename + ".json", string, function (err)
//  		{
//   			if (err) return console.log(err);
//   			console.log("Wrote to file");
// 		}
// 	);
// }

// function readJSON (filename) {

// 	var content = fs.readFileSync("files/" + filename + ".json");
// 	return JSON.parse(content);
// }

// function serverName (user, guild, removeSpecial = true) {

// 	if (!guild) {
// 		console.error("\nYou forgot the guild again!!!!!!!!\n")
// 	}

// 	var name = guild.member(user).nickname;

// 	if (removeSpecial && name != null) {
// 		name = name.replace(/[!_]/g,' ').replace(/([\u2B50]|[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
// 		name = name[0].toUpperCase() + name.substring(1);
// 	}

// 	if (name == undefined || name == "") {
// 		return user.username;
// 	} else {
// 		return name;
// 	}
// }

// function getMentionList (message, returnNames, removeSelf = true, removeBots = false) {

// 	var mentions = message.mentions.users.array();

// 	for (var i = 0; i < mentions.length; i++) {
// 		if ( (mentions[i] == message.author && removeSelf) || (mentions[i].bot && removeBots) ) {
// 			mentions.splice(i, 1);
// 		}
// 	}

// 	if (returnNames) {
// 		for (var i = 0; i < mentions.length; i++) {
// 			mentions[i] = serverName(mentions[i], message.guild);
// 		}
// 	}

// 	return mentions;
// }

// function arrayIntoList (array, defaultVal, bold = true) {

// 	if (array.length == 0) {
// 		return defaultVal;
// 	}

// 	var bd = "**";
// 	if (!bold) {
// 		bd = "";
// 	}

// 	var text = "";
// 	if (array.length <= 2) {
// 		if (array.length == 2) {
// 			text += bd + array[0] + bd + " and " + bd + array[1] + bd;
// 		} else {
// 			text += bd + array[0] + bd;
// 		}
// 	} else {
// 		for (var i = 0; i < array.length; i++) {
// 			if (i == array.length - 1) {
// 				text += " and ";
// 			}
// 			text += bd + array[i] + bd;
// 			if (i < array.length - 2) {
// 				text += ", ";
// 			}
// 		}
// 	}

// 	return text;
// }

// function randomString (array) {
// 	var pick = Math.floor(Math.random() * array.length);
// 	return array[pick];
// }

// function sendToDM (user, content) {

// 	var sendIt = function (channel, content) {
// 		channel.send(content).then(msg => console.log(`\nDM sent to ${user.username}:\n ${msg.content}\n`) ).catch(error => console.log(error) );
// 	}

// 	if (!user.dmChannel) {
// 		user.createDM().then(channel =>
// 			{
// 				sendIt(channel, content);

// 			}).catch(error => console.log(error) );
// 	} else {
// 		sendIt(user.dmChannel, content);
// 	}

// }

function helpCommand (message, args) {

	var embed = new Discord.MessageEmbed()
	.setThumbnail(Client.user.avatarURL() )
	.setColor("64BF51")
	.setFooter("This bot is a WIP by TheAlbinoDillo");

	if (args[1] != undefined) {

		if (categoryList.includes(args[1]) ) {
			for (var i = 0; i < commandList.length; i++) {
				if (commandList[i].category == args[1]) {
					embed.setTitle(`Command category: ${args[1]}`)
					.addField(`**${commandList[i].name}**${commandList[i].onlyOwner ? "®" : ""}\n${commandList[i].desc}`,`${prefix}${commandList[i].call} ${usageList(commandList[i])}`);
				}
			}
			botSend(message, embed);
			return;
		}

		var selected = -1;
		for (var i = 0; i < commandList.length; i++) {
			if (commandList[i].call == args[1]) {
				selected = i;
			}
		}

		if (selected > -1) {
			
			embed.setTitle(`Command: ${commandList[selected].name} ${commandList[selected].onlyOwner ? "[Restricted]" : ""}`)
			.addField(commandList[selected].desc, `${prefix}${commandList[selected].call} ${usageList(commandList[selected])}`);
			botSend(message, embed);
	
			return;
		}
	}


	embed.setTitle(`${Client.user.username} commands list`);

	for (var i = 0; i < categoryList.length; i++) {
		if (categoryList[i] == "unlisted") continue;
		embed.addField(`${categoryList[i]}`,`${prefix}help ${categoryList[i]}`);
	}

	botSend(message, embed);
}

// function usageList (command) {

// 	if (command.usage != undefined) {
// 		var list = command.usage.slice();
// 	for (var n = 0; n < command.usage.length; n++) {
// 			list[n] = ` <${command.usage[n]}>`;
// 		}
// 	} else {
// 		var list = "";
// 	}

// 	return list;
// }

// rl.on('line', (input) => {

// 	if (input == "leave") {
// 		leave();
// 	}
// });

// function leave (message) {
// 	console.log("Exiting...");
// 	if (message != undefined) message.delete();
// 	Client.setTimeout(function () {Client.destroy(); process.exit(621);}, 500);
// }

// function sendToMe (content) {
// 	sendToDM(Client.guilds.cache.get("704494659400892458").owner, content);
// }

// const commandList =
// [
// 	{//Help
// 		name: "Help",
// 		desc: "Get help",
// 		list: [],
// 		needsGuild: false,
// 		run: helpCommand
// 	},

// 	{//Server Info	
// 		call: "serverinfo",
// 		name: "Server Information",
// 		desc: "Get information about the server.",
// 		category: "tools",
// 		run: function (message, args) {
// 			var url = `https://cdn.discordapp.com/icons/${message.guild.id}/${message.guild.icon}.png`;

// 			var embed = new Discord.MessageEmbed()
// 			.setTitle(`Information for ${message.guild.name}`)
// 			.setThumbnail(url)
// 			.addField("Server Owner:", serverName(message.guild.owner.user, message.guild), true)
// 			.addField("Created On:", `${message.guild.createdAt.toLocaleString('default',{month:'long'})} ${message.guild.createdAt.getFullYear()}`, true)
// 			.addField("Member Count:", `${message.guild.memberCount} users`, true)
// 			.setFooter(`${message.guild.region} • ${message.guild.id} • ${message.guild.owner.user.username}#${message.guild.owner.user.discriminator}`);

// 			botSend(message, embed);
// 		}
// 	},

// 	{//Marco
// 		name: "Marco",
// 		desc: "Ping a simple responce from the bot",
// 		category: "tools",
// 		run: function (message, args) {
// 			pingTime = message.createdTimestamp;
// 			message.channel.send("Polo").then(message => {
// 				botEdit(message, ` \`${(message.createdTimestamp - pingTime)} ms\``, true);
// 			});
// 		}
// 	},

// 	{//Echo
// 		name: "Echo",
// 		desc: "Make the bot say what you say",
// 		delmsg: true,
// 		category: "tools",
// 		usage: ["text"],
// 		run: function (message, args) {
// 			var content = message.content.substring(prefix.length).substring(this.call.length);
// 			botSend(message, content);

// 			var lastEcho = new Object();
// 			lastEcho.userid = message.author.id;
// 			lastEcho.content = content;

// 			writeJSON("lastEcho", lastEcho);
// 		}
// 	},

// 	{//Inspect
// 		name: "Inspect",
// 		desc: "Inspect the last echo command",
// 		category: "tools",
// 		run: function (message, args) {
// 			var lastEcho = readJSON("lastEcho");

// 			message.guild.members.fetch(lastEcho.userid).then(user =>
// 					{
// 						botSend(message, `Uh oh, <@${lastEcho.userid}>! You got caught!\n**${serverName(user, message.guild)}** made me say \`${lastEcho.content.substring(1)}\``);
// 					}
// 				).catch(console.error);
// 		}
// 	},

// 	{//Decide
// 		name: "Decide",
// 		desc: "Randomly decide from values",
// 		category: "tools",
// 		usage: ["option1","option2","option.."],
// 		run: function (message, args) {

// 			var arr = args.slice();
// 			arr.shift();
// 			var pick = Math.floor(Math.random() * arr.length );
// 			var text = `Deciding from:\n${arrayIntoList(arr)}\nWinner is: **${arr[pick]}**`;
// 			botSend(message, text);
// 		},

// 	},

// 	{//Welcome
// 		name: "Welcome",
// 		desc: "Welcomes a new member to the server",
// 		delmsg: true,
// 		category: "tools",
// 		run: function (message, args) {
// 			botSend(message, `**Welcome to ${message.guild.name}!**\n Head on over to <#680991136378257433> to set yourself some tags, and <#685622079843860494> to ask for a custom role!`);
// 		}
// 	},

// 	{//Fezzy
// 		name: "Fezzy",
// 		desc: "Just posts a Sly Sabrina emote, heh.",
// 		category: "fun",
// 		run: function (message, args) {
// 			var url = "https://cdn.discordapp.com/emojis/595990003029639178.png?v=1";
// 			botSend(message, {files: [url]});
// 		}
// 	},

// 	{//Party
// 		name: "Party",
// 		desc: "It's a party! Let's groove!",
// 		category: "fun",
// 		run: function (message, args) {
// 			var url = "files/protoParty.gif";
// 			botSend(message, {files: [url]});
// 		}
// 	},

// 	{//Dance
// 		name: "Dance",
// 		desc: "Let's dance!",
// 		category: "fun",
// 		run: function (message, args) {

// 			var pick = [];
// 			var pickLength = fs.readdirSync("files/dance/").length;
// 			for (var i = 0; i < pickLength; i++) {
// 				pick[i] = `${i}`;
// 			}
// 			var url = `files/dance/dance${randomString(pick)}.gif`;
// 			botSend(message, {files: [url]});
// 		}
// 	},

// 	{//Hug
// 		name: "Hug",
// 		desc: "Give someone a hug!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "themselves");
// 			var picks = ["gives a hug to","gives a warm hug to","gives a tight hug to","wraps their arms around","embraces","warmly embraces","tightly embraces"];

// 			var text = `**${serverName(message.author, message.guild)}** ${randomString(picks)} ${arr}! <:GrantHug:704495124595474452>`;
// 			botSend(message, text);
// 		}
// 	},

// 	{//Nuzzle
// 		name: "Nuzzle",
// 		desc: "Give someone a comfy nuzzling!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "themselves");
// 			var picks1 = ["warmly ","comfily ","cozily "]; var picks2 = ["", "into "];

// 			var text = "**" + serverName(message.author, message.guild) + "** " + randomString(picks1) + "nuzzles " + randomString(picks2) + arr + "! <:GrantLove:704495125669216338>";
// 			botSend(message, text);
// 		}
// 	},

// 	{//Pet
// 		name: "Pet",
// 		desc: "Give someone some nice pets!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "themselves");

// 			var text = "**" + serverName(message.author, message.guild) + "** gives some soft pets to " + arr + "!";
// 			botSend(message, text);
// 		}
// 	},

// 	{//Cuddle
// 		name: "Cuddle",
// 		desc: "Give someone cuddly cuddles!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "themselves");
// 			var picks1 = ["","warmly ","softly ","gently ","happily "]; var picks2 = ["","with ","next to "];

// 			var text = "**" + serverName(message.author, message.guild) + "** "  + randomString(picks1) + "cuddles " + randomString(picks2) + arr + "!";
// 			botSend(message, text);
// 		}
// 	},

// 	{//Kiss
// 		name: "Kiss",
// 		desc: "Give someone a sloppy kiss!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "themselves");

// 			var text = "**" + serverName(message.author, message.guild) + "** gives " + arr + " a big kiss! <:GrantBlush:704495120514285641>";
// 			botSend(message, text);
// 		}
// 	},

// 	{//Spank
// 		name: "Spank",
// 		desc: "Give someone a spank on the butt!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "themselves");

// 			var text = "**" + serverName(message.author, message.guild) + "** spanks " + arr + " on the booty! <:GrantButt:708868787478200370> 👋";
// 			botSend(message, text);
// 		}
// 	},

// 	{//Ruffle
// 		name: "Ruffle",
// 		desc: "Ruffle up those feathery friends!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "their own");

// 			var text = "**" + serverName(message.author, message.guild) + "** ruffles " + arr + "'s feathers!";
// 			botSend(message, text);
// 		}
// 	},

// 	{//Boop
// 		name: "Boop",
// 		desc: "Boop 'em on the snoot!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "their own");

// 			var text = "**" + serverName(message.author, message.guild) + "** boops " + arr + "'s snoot! <:symbol_boop:692040846547091507>";
// 			botSend(message, text);
// 		}
// 	},

// 	{//Feed
// 		name: "Feed",
// 		desc: "Feed your friends some yummy food!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "themselves");

// 			var text = "**" + serverName(message.author, message.guild) + "** feeds " + arr + " " + randomString(foods.foodlist);
// 			botSend(message, text);
// 		}
// 	},

// 	{//Vore
// 		name: "Vore",
// 		desc: "Try eating someone.",
// 		category: "interactions",
// 		run: function (message, args) {
// 			botSend(message, "No.");
// 		}
// 	},

// 	{//Bonk
// 		name: "Bonk",
// 		desc: "Give someone a bonk on the head!",
// 		category: "interactions",
// 		run: function (message, args) {
// 			var arr = arrayIntoList(getMentionList(message, true), "themselves");

// 			var text = "**" + serverName(message.author, message.guild) + "** bonks " + arr + " on the head!";
// 			botSend(message, text);
// 		}
// 	},

// 	{//Add Food
// 		name: "Add Food",
// 		desc: "Add a food to the food list!",
// 		usage: ["food"],
// 		onlyOwner: true,
// 		run: function (message, args) {
// 			var content = message.content.substring(prefix.length).substring(this.call.length + 1);

// 			foods.foodlist.unshift(content);
// 			writeJSON("foods", foods);

// 			botSend(message, `\`${content}\` has been added to the food list.`)
// 		}
// 	},

// 	{//Remove last food
// 		name: "Remove Last Food",
// 		desc: "Remove the last food added to the list!",
// 		onlyOwner: true,
// 		run: function (message, args) {

// 			var removed = foods.foodlist.shift();
// 			writeJSON("foods", foods);

// 			botSend(message, `Removed \`${removed}\` from the food list.`);
// 		}
// 	},


// 	{//List Foods
// 		name: "List Foods",
// 		desc: "List everything on the food list!",
// 		onlyOwner: true,
// 		run: function (message, args) {
// 			var text = "";
// 			for (var i = 0; i < foods.foodlist.length; i++) {
// 				text += `${foods.foodlist[i]}\n`;
// 			}
// 			botSend(message, text)
// 		}
// 	},

// 	{//Seen
// 		call: "seen",
// 		name: "Last Seen",
// 		desc: "Get the last time the user has sent a message.",
// 		usage: ["@user"],
// 		category: "tools",
// 		run: function (message, args) {
// 			var mention = getMentionList(message, false, false, false)[0];

// 			var day = new Date(message.createdTimestamp).getDate();
// 			var month = new Date(message.createdTimestamp).toLocaleString('default',{month:'long'});
// 			var year = new Date(message.createdTimestamp).getFullYear();

// 			botSend(message, `**${serverName(mention, message.guild)}** was last seen ${month}, ${day} ${year}`);
// 		}
// 	},

// 	{//Calc
// 		call: "calc",
// 		name: "Calculator",
// 		desc: "Let the bot do math for you!",
// 		category: "tools",
// 		run: function (message, args) {
// 			var string = message.content.substring(prefix.length).replace(/[^0-9+-,=\/%*()!<>]/gi,'');

// 			try {
// 				console.log(string);
// 				var a = eval(string);
// 				botSend(message, a);
// 			} catch {
// 				error => {botSend(message, "Invalid Calculation"); console.log(error);}
// 			}
// 		}
// 	},

// 	{//Band
// 		call: "band",
// 		name: "Band Wagon",
// 		desc: "Join the band wagon!",
// 		category: "tools",
// 		usage: ["# | raffle | raffle- | pick"],
// 		run: function (message, args) {

// 			if (message.author != bandwagon.leader && bandwagon.limit > 0 && bandwagon.limit - bandwagon.members.length <= 0) {
// 				botSend(message, `Sorry ${serverName(message.author, message.guild)}, the band wagon is full.`);
// 				return;
// 			}

// 			if (bandwagon.members.length > 0) {
// 				if (message.author == bandwagon.leader) {

// 					if (args[1] == "raffle" || args[1] == "raffle-") {
// 						var pick = Math.floor(Math.random() * bandwagon.members.length);

// 						if (bandwagon.members.length <= 1) {
// 							botSend(message, "Wait for members before starting a raffle!");
// 							return;
// 						}

// 						while (bandwagon.members[pick] == bandwagon.leader) {
// 							pick = Math.floor(Math.random() * bandwagon.members.length);
// 						}

// 						var end = "!";
// 						if (args[1] == "raffle-") {
// 							bandwagon.members.splice(pick, 1);
// 							end = " and was removed!"
// 						}

// 						botSend(message, `<@${bandwagon.members[pick].id}> won the raffle ${end}`);
// 						return;
// 					}
// 					if (args[1] == "pick") {
// 						var pick = Math.floor(Math.random() * bandwagon.members.length);
// 						botSend(message, `<@${bandwagon.members[pick].id}> got picked!`);
// 						return;
// 					}

// 					bandwagon.limit = -1;
// 					bandwagon.members = [];
// 					botSend(message, `${serverName(message.author, message.guild)} has ended the band wagon.`);
// 					return;
// 				} else {
// 					for (var i = 0; i < bandwagon.members.length; i++) {
// 						if (bandwagon.members[i] == message.author) {
// 							bandwagon.members.splice(i, 1);
// 							botSend(message, `${serverName(message.author, message.guild)} has left the band wagon.`);
// 							return;
// 						}
// 					}
// 				}
// 			}

// 			if (bandwagon.members.length == 0) {
// 				bandwagon.members.push(message.author);
// 				bandwagon.leader = message.author;

// 				if (Math.abs(parseInt(args[1]) ) > 1) {
// 					bandwagon.limit = Math.abs(parseInt(args[1]) );
// 				}

// 				botSend(message, `${serverName(message.author, message.guild)} has started a band wagon.\nUse **${prefix}${this.call}** to join!`);
// 				if (bandwagon.limit > 0) {
// 					botSend(message, `${bandwagon.limit - bandwagon.members.length} members remaining.`)
// 				}
// 			} else {
// 				bandwagon.members.push(message.author);
// 				var names = [];
// 				for (var i = 0; i < bandwagon.members.length; i++) {
// 					names[i] = serverName(bandwagon.members[i], message.guild);
// 				}
// 				botSend(message, `${serverName(message.author, message.guild)} has joined the band wagon.\n${arrayIntoList(names)} are in the band wagon!`);
// 				if (bandwagon.limit > 0) {
// 					botSend(message, `${bandwagon.limit - bandwagon.members.length} members remaining.`)
// 				}
// 			}
// 		}
// 	},

// 	{//Leave
// 		name: "Leave",
// 		desc: "Disconnet the bot.",
// 		onlyOwner: true,
// 		delmsg: true,
// 		run: function (message, args) {
// 			requestDestroy = true;
// 		}
// 	},

// 	{//Type
// 		name: "Type",
// 		desc: "Make the bot type out a message",
// 		onlyOwner: true,
// 		usage: ["text"],
// 		run: async function (message, args) {
// 			var content = message.content.substring(prefix.length + this.call.length + 1);
// 			var msg = await botSend(message, content[0]);
// 			var edit = await botEdit(msg, content[1], true);
// 			for (var i = 2; i < content.length; i++) {
// 				//await sleep(400);
// 				if (content[i] == " ") {
// 					edit = await botEdit(edit, content[i] + content[i + 1], true);
// 					i++;
// 					continue;
// 				}
// 				edit = await botEdit(edit, content[i], true);
// 			}
// 		}
// 	},

// 	{//Am I Cute
// 		name: "Am I cute",
// 		desc: "Let the bot determine if you are a cutie",
// 		category: "fun",
// 		run: function (message, args) {
// 			var picks = ["Yes!","Yes.","Of course!","All the time!","Without a doubt!","100% of the time!","Only on days that end in \"Y\"","Si","💯","Absolutely!","Yup!","Sure are!","Totes.","Totally!","Definitely!","Certainly!","Undoubtedly!","Only if ```(true != false)```"];
// 			botSend(message, randomString(picks) );
// 		}
// 	}

// 	//fg.minecraft

// 	//fg.timezone
// ];