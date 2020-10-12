const Discord = require("discord.js");
const emojis = require("../data/emoji/movie");

function createMessage() {
	return new Discord.MessageEmbed().setColor("#0099ff").setTitle("Emoji Game");
}

exports.run = (client, message, args) => {
	const spiel = createMessage().addFields(
		emojis.map(({ question }, i) => ({ name: `#${i + 1}`, value: question }))
	);
	message.channel.send(spiel);
};

exports.help = "Show all emojis in emoji game";
exports.aliases = [];
