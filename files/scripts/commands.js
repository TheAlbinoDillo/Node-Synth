const Discord = require("discord.js");
const FileSystem = require("fs");
const Tools = require("./botTools.js");

const Prefix = 'fg.';

class Command {
	constructor(name, runFunction = function () {}, description = "", category, usage = [], deleteMessage = false, permissions = [], call = false) {
		this.name = name;
		this.runFunction = runFunction;
		this.description = description;
		this.category = category ? category : "unlisted";
		this.usage = usage;
		this.deleteMessage = deleteMessage;
		this.permissions = permissions;
		this.call = call ? call : name.toLowerCase().replace(/ /g, "");
	}
}

class Interaction extends Command {
	constructor(name, description, outputs, call, defaultWord = "themselves") {
		super
		(
			name,
			function (message, args)
			{
				let arr = Tools.arrayIntoList(Tools.getMentionList(message, true) ) || defaultWord;
				let picks = this.outputs;

				let text = `${Tools.serverName(message.author, message.guild)}${Tools.randArray(picks[0])} ${Tools.randArray(picks[1])} ${arr}${Tools.randArray(picks[2])}`;
				return text;
			},
			description = description,
			"interactions",
			["@user1 @user2 @user.."],
			false,
			[],
			call ? call : name.toLowerCase().replace(/ /g, "")
		);
		this.outputs = outputs;
	}
}

var commandCategoryList = new Array();
const commandList =
[
	new Command("Help", helpCommand, "Get help"),

	new Interaction("Hug", "Give someone a hug!",
		[
			["", " quickly", " happily"],
			["gives a hug to", "hugs"],
			["!", ", how nice!", ", awwww."]
		]
	),

	new Interaction("Cuddle", "Cuddle up with someone!",
		[
			[""],
			["cuddles"],
			["!"]
		]
	),

	new Interaction("Nuzzle", "Nuzzle with someone!",
		[
			[" cozily", " warmly"],
			["nuzzles", "nuzzles with", "nuzzles into"],
			["!"]
		]
	),

	new Interaction("Snuggle", "Snuggle with someone!",
		[
			[" cozily", " warmly"],
			["snuggles", "snuggles with", "snuggles into"],
			["!"]
		]
	),

	new Interaction("High Five", "Give someone a high five!",
		[
			[""],
			["high fives"],
			["!"]
		],
		"high"
	),

	new Interaction("Tase", "Give someone a shock!!",
		[
			[""],
			["tases","uses a taser on"],
			["!",", take that!",", ouch!"]
		]
	),

	new Interaction("Poke", "Poke poke poke someone!",
		[
			["", " rapidly"],
			["pokes","poke poke pokes"],
			["!","!","!","!","!", ", poke!",", pppppppppppoke!"]
		]
	),

	new Interaction("Spank", "Give someone the spanking they deserve!",
		[
			[""],
			["spanks", "raises their arm and spanks"],
			["!"," on the booty!"]
		]
	),

	new Interaction("Slap", "Slap someone!",
		[
			[" quickly", ""],
			["slaps"],
			["!"," on the face!"]
		]
	),

	new Interaction("Kiss", "Give someone a nice kiss!",
		[
			["", "", " puckers up and", " smiles and"],
			["kisses", "kisses", "gives a big kiss to"],
			["!", "!", " on the lips!", " on the cheek!"]
		]
	),

	new Interaction("Pet", "Give someone some nice pets!",
		[
			[" softly"],
			["pets","kneads their paws into"],
			["!"]
		]
	),

	new Interaction("Pat", "Give someone some nice pats!",
		[
			[" softly"],
			["pats"],
			["!", " on the head!"]
		]
	),

	new Interaction("Boop", "Give someone a boop on the snoot!",
		[
			["", " playfully", " quickly"],
			["boops"],
			["!", " on the snoot!", " on the nose!"]
		]
	),

	new Interaction("Bite", "Give someone a bite! Rawr!",
		[
			["", " playfully", " quickly", " angrily"],
			["bites"],
			["!", "!", " on the face!", " on the arm!", " on the tail!"]
		]
	),

	new Command("Bark", function (message, args)
		{
			let picks1 = ["", " Woof Woof!", " Woof!", " Ruff!", " Ruff Ruff!", " Arrwf!", " Awrf!", " Awrf awrf!"];

			let text = `${Tools.serverName(message.author, message.guild)} barks!${Tools.randArray(picks1)}`;
			return text;

		}, "Bark to be heard!", "actions", []
	),

	new Command("Vore", function (message, args)
		{
			return "No.";

		}, "Try to eat someone!", "interactions", ["@user1 @user2 @user.."]
	),

	new Command("Wag", function (message, args)
		{
			let picks1 = ["", " rapidly", " happily", " adorably"]
			let picks2 = ["", " *wag wag wag*", " awwwwww.", " *wag wags*", " *waggies*"];

			let text = `${Tools.serverName(message.author, message.guild)}${Tools.randArray(picks1)} wags their tail!${Tools.randArray(picks2)}`;
			return text;

		}, "Wag your tail!", "actions", []
	),

	new Command("Purr", function (message, args)
		{
			let picks1 = ["", " softly", " happily", " adorably"]
			let picks2 = ["", " *purr*", " awwwwww.", " *purrrrr*"];

			let text = `${Tools.serverName(message.author, message.guild)}${Tools.randArray(picks1)} purrs!${Tools.randArray(picks2)}`;
			return text;

		}, "Purr like a kitty!", "actions", []
	),

	new Command("Ruffle", function (message, args)
		{
			let arr = Tools.arrayIntoList(Tools.getMentionList(message, true) ) || "their own";

			let picks1 = ["", " gently", " softly"];
			let picks2 = ["ruffles"];
			let picks3 = [" feathers!", " feathers, squawk!"];

			let text = `${Tools.serverName(message.author, message.guild)}${Tools.randArray(picks1)} ${Tools.randArray(picks2)} ${arr}${args[1] ? "'s" : ""}${Tools.randArray(picks3)}`;
			return text;

		}, "Give someone a boop on the snoot!", "interactions", ["@user1 @user2 @user.."]
	),

	new Command("Feed", function (message, args)
		{
			let arr = Tools.arrayIntoList(Tools.getMentionList(message, true) ) || "themselves";

			let foodlist = Tools.settings.read(message.guild, "foods");

			if (foodlist == null) {
				botSend(message, "The food list is empty.");
				return;
			}

			let matches = [];
			if (args[1]) {
				for (let i = 0, l = foodlist.length; i < l; i++) {
					if (foodlist[i].includes(args[1]) ) {
						matches.push(foodlist[i]);
					}
				}
			}

			let text = `${Tools.serverName(message.author, message.guild)} feeds ${arr} ${matches.length > 0 ? Tools.randArray(matches) : Tools.randArray(foodlist)}`;
			return text;

		}, "Give someone a nice snack!", "interactions", ["@user1 @user2 @user.."]
	),

	new Command("Foods", function (message, args)
		{
			if (args[1] == "add") {
				let text = message.content.substring(Prefix.length + args[0].length + args[1].length + 2);
				Tools.settings.write(message.guild, "foods", text, true);
				return `Added \`${text}\` to the food list.`;
			}

			if (args[1] == "search") {
				let foodlist = Tools.settings.read(message.guild, "foods");
				let matches = [];

				for (let i = 0, l = foodlist.length; i < l; i++) {
					if (foodlist[i].includes(args[2]) ) {
						matches.push({text: foodlist[i], index: i});
					}
				}

				if (matches.length == 0) {
					return `No matches for \`${args[2]}\``;
				}

				let text = "Search results:\n";
				for (let i = 0, l = matches.length; i < l; i++) {
					text += `${matches[i].index}: \`${matches[i].text}\`\n`;
				}

				return text;
			}

			if (args[1] == "remove") {
				if (parseInt(args[2]) == NaN) {
					return "Not a valid selection.";
				} else {
					let foodlist = Tools.settings.read(message.guild, "foods");
					let removed = foodlist.splice(parseInt(args[2]), 1);
					Tools.settings.write(message.guild, "foods", foodlist);
					return `Removed \`${removed}\` from the food list.`;
				}
			}

			if (args[1] == "rmlast") {
				let foodlist = Tools.settings.read(message.guild, "foods");
				let removed = foodlist.pop();
				Tools.settings.write(message.guild, "foods", foodlist);
				return `Removed \`${removed}\` from the food list.`;
			}

		}, "Add a food to the food list.", "settings", ["add [text] | rmlast | search [text] | remove [number]"], false, ["MANAGE_CHANNELS"]
	),

	new Command("Server Information", function (message, args) {
			let g = message.guild;
			let url = `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`;

			let embed = new Discord.MessageEmbed()
			.setTitle(`Information for ${g.name}`)
			.setThumbnail(url)
			.addField("Server Owner:", Tools.serverName(g.owner.user, g), true)
			.addField("Created On:", `${g.createdAt.toLocaleString('default',{month:'long'})} ${g.createdAt.getFullYear()}`, true)
			.addField("Member Count:", `${g.memberCount} users`, true)
			.setFooter(`${g.region} • ${g.id} • ${g.owner.user.username}#${g.owner.user.discriminator}`);

			return embed;
		}, "Get information about the server.", "tools", [], false, [], "serverinfo"
	),

	new Command("Echo", function (message, args)
		{
			let text = message.content.substring(Prefix.length).substring(this.call.length);
			return text;
		}, "Make the bot say what you say", "tools", ["text"], true, ["MANAGE_MESSAGES"]
	),

	new Command("UwU Speak", function (message, args) {
			return `${message.author} (${Prefix}${this.call}):\n${Tools.makeUwU(message.content.substring(Prefix.length + args[0].length) )}`;
		}, "Convert to UwU speak!", "fun", ["text"], true, [], "uwu"
	),

	new Command("Decide", function (message, args) {

			let arr = args.slice();
			arr.shift();
			let pick = Math.floor(Math.random() * arr.length);
			let text = `Deciding from:\n${Tools.arrayIntoList(arr)}\nWinner is: **${arr[pick]}**`;
			return text;
		}, "Randomly decide from values", "tools", ["option1","option2","option.."]
	),

	new Command("Dance", function (message, args) {

			let pickLength = FileSystem.readdirSync("./files/common/dance/").length;
			let choice = parseInt(args[1]);
			let pick = choice > -1 ? choice : Tools.randNumber(pickLength)

			let url = `./files/common/dance/dance${pick}.gif`;
			return {content: pick, files: [url]};
		}, "Let's dance!", "fun"
	),

	new Command("Grant", function (message, args) {

			let pickLength = FileSystem.readdirSync("./files/common/grant/").length;
			let choice = parseInt(args[1]);
			let pick = choice > -1 ? choice : Tools.randNumber(pickLength)

			let url = `./files/common/grant/grant${pick}.png`;
			return {content: pick, files: [url]};
		}, "Get a picture of the panda!", "fun"
	),

	new Command("Fox", function (message, args) {

			let pickLength = FileSystem.readdirSync("./files/common/fox/").length;
			let choice = parseInt(args[1]);
			let pick = choice > -1 ? choice : Tools.randNumber(pickLength)

			let url = `./files/common/fox/fox${pick}.png`;
			return {content: pick, files: [url]};
		}, "Get a picture of a cute fox!", "fun"
	),

	new Command("Leave", function (message, args) {
			Tools.disconnect(message.client);
			return null;
		}, "Disconnect the bot.", null, [], false, ["ADMINISTRATOR"]
	),

	new Command("List Emotes", function (message, args) {
			
			let emotes = message.guild.emojis.cache.array();
			let list = [];

			for (let i = 0, l = emotes.length; i < l; i++) {
				list.push(emotes[i].toString() );
			}

			return list;

		}, "List all the server's emotes.", null, [], true, ["ADMINISTRATOR"]
	),

	new Command("Vote", function (message, args) {
			
			if (args[1] == "images" || args[1] == "all"|| args[1] == "off") {
				Tools.settings.write(message.guild, [message.channel.id, "vote"], args[1], true);
				return `Channel vote setting set to **${args[1]}**.`;
			} else {
				return `**${args[1]}** is not a valid setting for voting.`;
			}

		}, "Setup this channel with react voting.", "settings", ["images | all | off"], false, ["ADMINISTRATOR"]
	),

	new Command("Calculator", function (message, args) {
			let exp = message.content.substring(Prefix.length + args[0].length);

			var text = "";
			try {
				text = MathJS.evaluate(exp).toString();
			} catch (error) {
				text = error.message;
			}

			return text;
		}, "Enslave the bot to do math!", "tools", ["expression"], false, [], "calc"
	),

	new Command("Test Error", "This is not supposed to be a string", "", null),

	new Command("Hex Color", function (message, args) {

			if (args[1] == "FUCKME") {
				return "OwO";
			}

			if (args[1] == null) {
				return `Specify a hex code.`;
			}

			if (args[1].replace(/[^a-f0-9]/gi,'').length != 6) {
				return `**${args[1]}** is not a valid hex code.`;
			}	

			let colorName = Tools.colors.closest(args[1]);
			let colorCode = Tools.colors.format(args[1]).substring(1);
			let url = `https://via.placeholder.com/50/${colorCode}/${colorCode}.png`;

			let embed = new Discord.MessageEmbed()
			.setThumbnail(url)
			.addField(colorCode, colorName);

			return embed;

		}, "Get a preview of a hex color!", "tools", ["hex code"], false, [], "hex"
	),

	new Command("To Binary", function (message, args) {

			if (parseInt(args[1]) == NaN) {
				botSend(message, `**${args[1]}** is not a valid number.`);
				return;
			}

			return parseInt(args[1]).toString(2);
		}, "Turn a number into binary!", "tools", ["number"], false, [], "tobin"
	)
];

for (let i = 0, l = commandList.length; i < l; i++) {

	let cmdi = commandList[i];
	if (!commandCategoryList.includes(cmdi.category) ) {
		commandCategoryList.push(cmdi.category);
	}
}

function helpCommand (message, args) {

	let embed = new Discord.MessageEmbed()
	//.setThumbnail(Client.user.avatarURL() )
	.setColor("64BF51")
	.setFooter("This bot is a WIP by TheAlbinoDillo");

	if (args[1] != undefined) {
		if (commandCategoryList.includes(args[1]) ) {
			for (let i = 0, l = commandList.length; i < l; i++) {
				let cli = commandList[i];
				if (cli.category == args[1]) {
					embed.setTitle(`Command category: ${args[1]}`)
					.addField(`**${cli.name}**${cli.onlyOwner ? "®" : ""}\n${cli.description}`,`${Prefix}${cli.call} ${usageList(cli)}`);
				}
			}
			return embed;
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
			.addField(cls.description, `${Prefix}${cls.call} ${usageList(cls)}`);
			
			return embed;
		}
	}
	embed.setTitle(`FurGun commands list`);

	for (let i = 0, l = commandCategoryList.length; i < l; i++) {

		let ccli = commandCategoryList[i];
		if (ccli == "unlisted") {
			continue;
		}
		embed.addField(`${ccli}`,`${Prefix}help ${ccli}`);
	}

	return embed;
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

module.exports =
{
	commandList: commandList,
	prefix: Prefix
};