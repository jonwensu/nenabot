const Discord = require("discord.js");
const firebase = require("firebase/app");
const database = firebase.database();

let candies = [];

const init = () => {
	database.ref("/candies").on("value", (snapshot) => {
		candies = snapshot.val();
		console.log("Added", candies[candies.length - 1]);
	});
};

init();

const {
	bold,
	mentionAuthor,
	doRoll,
	pick,
	shuffle,
} = require("../util/formatUtil");

function createMessage() {
	return new Discord.MessageEmbed().setColor("#F75F1C");
}

exports.run = (client, message, args) => {
	console.log(candies);
	const candy = pick(candies);

	const spiel = `Binigyan ni Aling Nena si ${mentionAuthor(message)} ng ${bold(
		candy.name.toUpperCase()
	)}`;

	const embed = createMessage()
		.setTitle("Trick or Treat 🎃")
		.setDescription(spiel)
		.setImage(pick(candy.img));

	message.channel.send(embed);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["tot"];
