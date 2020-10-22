const Discord = require("discord.js");
const pool = require("../data/pastokq");

const { mentionAuthor, pick } = require("../util/formatUtil");

function createMessage(target) {
	return new Discord.MessageEmbed().setColor("#0099ff").setTitle(target);
}
let recent = [];

const limit = 5;

exports.run = (client, message, args) => {
	const {
		channel: { guild },
		author: { username },
	} = message;

	const mention = message.mentions.members.first();
	const avatar = mention || { user: message.author };
	const member = mention || guild.member(message.author);
	const nickname = member ? member.displayName : null;
	const spiel = createMessage(`${pick(pool).toUpperCase()}?`)
		.setAuthor(
			`${nickname || username}, IKAW NA!`,
			"https://cdn.discordapp.com/attachments/765047137473265714/768419284765507634/tito_boy.png"
		)
		.setThumbnail(avatar.user.displayAvatarURL({ format: "png" }));
	message.channel.send(spiel);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["hl"];
