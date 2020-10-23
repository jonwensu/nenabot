const Discord = require("discord.js");
const firebase = require("firebase/app");
const database = firebase.database();

let pool = [];

const init = () => {
	database.ref("/questions").on("value", (snapshot) => {
		pool = snapshot.val();
		console.log("Added", pool[pool.length - 1]);
	});
};

init();

const { mentionAuthor, pick } = require("../util/formatUtil");

function createMessage(target) {
	return new Discord.MessageEmbed().setColor("#0099ff").setTitle(target);
}
let recent = [];

exports.run = async (client, message, args) => {
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

	const cd = Math.floor(pool.length * 0.4);

	recent.push({
		question: activeQ,
		cooldown: cd,
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
