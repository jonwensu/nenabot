const Discord = require("discord.js");
const pool = require("../data/pastokq");

const { mentionAuthor, pick } = require("../util/formatUtil");

function createMessage(target) {
	return new Discord.MessageEmbed().setColor("#0099ff").setTitle(target);
}
let recent = [];

const DEFAULT_CD = 10;

exports.run = (client, message, args) => {
	const {
		channel: { guild },
		author: { username },
	} = message;

	const mention = message.mentions.members.first();
	const avatar = mention || { user: message.author };
	const member = mention || guild.member(message.author);
	const nickname = member ? member.displayName : null;
	const filtered = pool.filter(
		(p) =>
			!recent
				.map(({ question }) => question.toLowerCase().trim())
				.includes(p.toLowerCase().trim())
	);

	recent = recent
		.map(({ cooldown, ...r }) => ({ cooldown: +cooldown - 1, ...r }))
		.filter(({ cooldown }) => cooldown > 0);

	const activeQ = pick(filtered).trim().toUpperCase();

	recent.push({
		question: activeQ,
		cooldown: DEFAULT_CD,
	});

	const spiel = createMessage(`${activeQ}?`)
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
