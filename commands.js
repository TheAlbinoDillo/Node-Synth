const Tools = require("./botTools.js");
const Discord = require("discord.js");
const Messaging = require("./botMessaging.js");
const FileSystem = require("fs");
const Index = require("./index.js");

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

			Messaging.botSend(message, embed);
		}
	},

	{//Marco
		name: "Marco",
		desc: "Ping a simple responce from the bot",
		category: "tools",
		run: function (message, args) {
			let pingTime = message.createdTimestamp;
			message.channel.send("Polo").then(msg => {
				Messaging.botEdit(msg, `**Polo** \`${(msg.createdTimestamp - pingTime)} ms\``);
			}).catch(error => {
				Messaging.botError(`Error sending marcopolo message:\n${error.message}\n`);
			});
		}
	},

	{//Echo
		name: "Echo",
		desc: "Make the bot say what you say",
		category: "tools",
		usage: ["text"],
		perms: ["MANAGE_MESSAGES"],
		delmsg: true,
		run: function (message, args) {
			let content = message.content.substring(Prefix.length).substring(this.call.length);
			Messaging.botSend(message, content);
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
			let text = `Deciding from:\n${Tools.arrayIntoList(arr)}\nWinner is: **${arr[pick]}**`;
			Messaging.botSend(message, text);
		},

	},

	{//Welcome
		name: "Welcome",
		desc: "Welcomes a new member to the server",
		category: "tools",
		delmsg: true,
		run: function (message, args) {
			Messaging.botSend(message, `**Welcome to ${message.guild.name}!**\n Head on over to <#680991136378257433> to set yourself some tags, and <#685622079843860494> to ask for a custom role!`);
		}
	},

	{//Fezzy
		name: "Fezzy",
		desc: "Just posts a Sly Sabrina emote, heh.",
		category: "fun",
		run: function (message, args) {
			let url = "files/fezzy.png";
			Messaging.botSend(message, {files: [url]});
		}
	},

	{//Party
		name: "Party",
		desc: "It's a party! Let's groove!",
		category: "fun",
		run: function (message, args) {
			let url = "files/protoParty.gif";
			Messaging.botSend(message, {files: [url]});
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

			let url = `files/dance/dance${Tools.randArray(pick)}.gif`;
			Messaging.botSend(message, {files: [url]});
		}
	},

	{//Hug
		name: "Hug",
		desc: "Give someone a hug!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "themselves";
			let picks = ["gives a hug to","gives a warm hug to","gives a tight hug to","wraps their arms around","embraces","warmly embraces","tightly embraces"];

			let text = `${serverName(message.author, message.guild)} ${Tools.randArray(picks)} ${arr}!`;
			Messaging.botSend(message, text);
		}
	},

	{//Nuzzle
		name: "Nuzzle",
		desc: "Give someone a comfy nuzzling!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "themselves";
			let picks1 = ["warmly","comfily","cozily"];
			let picks2 = [" ", " into "];

			let text = `${serverName(message.author, message.guild)} ${Tools.randArray(picks1)} nuzzles${Tools.randArray(picks2)}${arr}!`;
			Messaging.botSend(message, text);
		}
	},

	{//Pet
		name: "Pet",
		desc: "Give someone some nice pets!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} gives some soft pets to ${arr}!`;
			Messaging.botSend(message, text);
		}
	},

	{//Cuddle
		name: "Cuddle",
		desc: "Give someone cuddly cuddles!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "themselves";
			let picks1 = ["","warmly ","softly ","gently ","happily "];
			let picks2 = ["","with ","next to "];

			let text = `${serverName(message.author, message.guild)} ${Tools.randArray(picks1)}cuddles ${Tools.randArray(picks2)}${arr}!`;
			Messaging.botSend(message, text);
		}
	},

	{//Kiss
		name: "Kiss",
		desc: "Give someone a sloppy kiss!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} gives ${arr} a big kiss!`;
			Messaging.botSend(message, text);
		}
	},

	{//Spank
		name: "Spank",
		desc: "Give someone a spank on the butt!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} spanks ${arr} on the booty!`;
			Messaging.botSend(message, text);
		}
	},

	{//Ruffle
		name: "Ruffle",
		desc: "Ruffle up those feathery friends!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "their own";

			let text = `${serverName(message.author, message.guild)} ruffles ${arr}${(arr == "themselves") ? "" : "'s"} feathers!`;
			Messaging.botSend(message, text);
		}
	},

	{//Boop
		name: "Boop",
		desc: "Boop 'em on the snoot!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "their own";

			let text = `${serverName(message.author, message.guild)} boops ${arr}${(arr == "themselves") ? "" : "'s"} snoot!`;
			Messaging.botSend(message, text);
		}
	},

	{//Feed
		name: "Feed",
		desc: "Feed your friends some yummy food!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} feeds ${arr} ${Tools.randArray(foodCommandList.foodlist)}`;
			Messaging.botSend(message, text);
		}
	},

	{//Bonk
		name: "Bonk",
		desc: "Give someone a bonk on the head!",
		category: "interactions",
		run: function (message, args) {
			let arr = Tools.arrayIntoList(getMentionList(message, true) ) || "themselves";

			let text = `${serverName(message.author, message.guild)} bonks ${arr} on the head!`;
			Messaging.botSend(message, text);
		}
	},

	{//Add Food
		name: "Add Food",
		desc: "Add a food to the food list!",
		usage: ["food"],
		perms: ["ADMINISTRATOR"],
		run: function (message, args) {
			let content = message.content.substring(Prefix.length).substring(this.call.length + 1);

			foodCommandList.foodlist.unshift(content);
			Tools.writeJSON("foods", foodCommandList);

			Messaging.botSend(message, `\`${content}\` has been added to the food list.`)
		}
	},

	{//Remove last food
		name: "Remove Last Food",
		desc: "Remove the last food added to the list!",
		perms: ["ADMINISTRATOR"],
		run: function (message, args) {

			let removed = foodCommandList.foodlist.shift();
			Tools.writeJSON("foods", foodCommandList);

			Messaging.botSend(message, `Removed \`${removed}\` from the food list.`);
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

			let time = new Date(mention.lastMessage.createdTimestamp);
			let day = time.getDate();
			let month = time.toLocaleString('default',{month:'long'});
			let year = time.getFullYear();

			Messaging.botSend(message, `**${serverName(mention, message.guild)}** last sent a message ${month}, ${day} ${year}`);
		}
	},

	{//Band
		call: "band",
		name: "Band Wagon",
		desc: "Join the band wagon!",
		category: "tools",
		usage: ["# | raffle | raffle- | pick"],
		run: function (message, args) {

			if (message.author != bandwagonCommandVar.leader && bandwagonCommandVar.limit > 0 && bandwagonCommandVar.limit - bandwagonCommandVar.members.length <= 0) {
				Messaging.botSend(message, `Sorry ${serverName(message.author, message.guild)}, the band wagon is full.`);
				return;
			}

			if (bandwagonCommandVar.members.length > 0) {
				if (message.author == bandwagonCommandVar.leader) {

					if (args[1] == "raffle" || args[1] == "raffle-") {
						var pick = Math.floor(Math.random() * bandwagonCommandVar.members.length);

						if (bandwagonCommandVar.members.length <= 1) {
							Messaging.botSend(message, "Wait for members before starting a raffle!");
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

						Messaging.botSend(message, `<@${bandwagonCommandVar.members[pick].id}> won the raffle ${end}`);
						return;
					}
					if (args[1] == "pick") {
						var pick = Math.floor(Math.random() * bandwagonCommandVar.members.length);
						Messaging.botSend(message, `<@${bandwagonCommandVar.members[pick].id}> got picked!`);
						return;
					}

					bandwagonCommandVar.limit = -1;
					bandwagonCommandVar.members = [];
					Messaging.botSend(message, `${serverName(message.author, message.guild)} has ended the band wagon.`);
					return;
				} else {
					for (var i = 0; i < bandwagonCommandVar.members.length; i++) {
						if (bandwagonCommandVar.members[i] == message.author) {
							bandwagonCommandVar.members.splice(i, 1);
							Messaging.botSend(message, `${serverName(message.author, message.guild)} has left the band wagon.`);
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

				Messaging.botSend(message, `${serverName(message.author, message.guild)} has started a band wagon.\nUse **${Prefix}${this.call}** to join!`);
				if (bandwagonCommandVar.limit > 0) {
					Messaging.botSend(message, `${bandwagonCommandVar.limit - bandwagonCommandVar.members.length} members remaining.`)
				}
			} else {
				bandwagonCommandVar.members.push(message.author);
				var names = [];
				for (var i = 0; i < bandwagonCommandVar.members.length; i++) {
					names[i] = serverName(bandwagonCommandVar.members[i], message.guild);
				}
				Messaging.botSend(message, `${serverName(message.author, message.guild)} has joined the band wagon.\n${Tools.arrayIntoList(names)} are in the band wagon!`);
				if (bandwagonCommandVar.limit > 0) {
					Messaging.botSend(message, `${bandwagonCommandVar.limit - bandwagonCommandVar.members.length} members remaining.`)
				}
			}
		}
	},

	{//Leave
		name: "Leave",
		desc: "Disconnect the bot.",
		delmsg: true,
		onlyOwner: true,
		run: function (message, args) {
			Disconnect(message);
		}
	},

	{//Am I Cute
		name: "Am I cute",
		desc: "Let the bot determine if you are a cutie",
		category: "fun",
		run: function (message, args) {
			let picks = ["Yes!","Yes.","Of course!","All the time!","Without a doubt!","100% of the time!","Only on days that end in \"Y\"","Si","💯","Absolutely!","Yup!","Sure are!","Totes.","Totally!","Definitely!","Certainly!","Undoubtedly!","Only if ```(true != false)```"];
			Messaging.botSend(message, Tools.randArray(picks) );
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

			Messaging.botSend(message, text);
		}
	},

	{
		name: "Test Error",
		desc: "See if the error emote works",
		onlyOwner: true,
		run: function (message, args) {
			let text = "";

			for (let i = 0; i <= 2000; i++) {
				text = `${text}e`;
			}

			Messaging.botSend(message, text);
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
				Messaging.botSend(message, "Not a valid hex code. (**#**ABC123)");
				return;
			}

			let url = `https://www.thecolorapi.com/id?hex=${hex}`;
			Request({
				url: url, json: true
			}, function (error, response, body) {
				if (!error && response.statusCode === 200) {
					let embed = new Discord.MessageEmbed()
					.addField(`\n${body.hex.value}`, body.name.value)
					.setThumbnail(`http://via.placeholder.com/50/${body.hex.clean}/${body.hex.clean}`);
					Messaging.botSend(message, embed);
				}
			});
		}
	},

	{
		name: "Enable Logging",
		onlyOwner: true,
		run: function (message, args) {
			Messaging.consoleLogging.enabled = true;
			Messaging.consoleLogging.user = message.guild.owner.user;

			botLog("Started Logging.");
		}
	}
];

console.log(Index.Client);
function helpCommand (message, args) {

	let embed = new Discord.MessageEmbed()
	.setThumbnail(Index.Client.user.avatarURL() )
	.setColor("64BF51")
	.setFooter("This bot is a WIP by TheAlbinoDillo");

	if (args[1] != undefined) {
		if (commandCategoryList.includes(args[1]) ) {
			for (let i = 0, l = Commands.commandList.length; i < l; i++) {
				let cli = Commands.commandList[i];
				if (cli.category == args[1]) {
					embed.setTitle(`Command category: ${args[1]}`)
					.addField(`**${cli.name}**${cli.onlyOwner ? "®" : ""}\n${cli.desc}`,`${Prefix}${cli.call} ${usageList(cli)}`);
				}
			}
			Messaging.botSend(message, embed);
			return;
		}
		let selected = -1;
		for (let i = 0, l = Commands.commandList.length; i < l; i++) {
			if (Commands.commandList[i].call == args[1]) {
				selected = i;
			}
		}
		if (selected > -1) {
			let cls = Commands.commandList[selected];
			embed.setTitle(`Command: ${cls.name} ${cls.onlyOwner ? "[Restricted]" : ""}`)
			.addField(cls.desc, `${Prefix}${cls.call} ${usageList(cls)}`);
			Messaging.botSend(message, embed);
	
			return;
		}
	}
	embed.setTitle(`${Index.Client.user.username} commands list`);

	for (let i = 0, l = commandCategoryList.length; i < l; i++) {

		let ccli = commandCategoryList[i];
		if (ccli == "unlisted") {
			continue;
		}
		embed.addField(`${ccli}`,`${Prefix}help ${ccli}`);
	}

	Messaging.botSend(message, embed);
}

var bandwagonCommandVar = { leader: undefined, limit: -1, members: [] };
var foodCommandList = Tools.readJSON("foods");

module.exports = {
	commandList: commandList
};