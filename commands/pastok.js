const Discord = require("discord.js");

const { mentionAuthor, pick } = require("../util/formatUtil");

const pool = [
	`food or travel`,
	`sinigang o adobo`,
	`umaga o gabi`,
	`face or personality`,
	`toblerone or hershey's`,
	`reese's or snickers`,
	`yes or No, Mahal mo na ba crush mo`,
	`sex or chocolates`,
	`pizza or burger`,
	`Magising sa katotohanan or mabuhay sa kasinungalingan`,
	`Yes or No, Magaling ka ba sa Calculus`,
	`one million pesos or si crush`,
	`KZ or Kyla`,
	`Mahal mo o mahal ako`,
	`twitter or Instagram`,
	`Math or Science`,
	`Dolphy or Vice Ganda`,
	`Lights on or lights off`,
	`Harry Roque or Salvador Panelo`,
	`Paksiw na Isda or Isdang Paksiw`,
	`Mister Donut or Dunkin Donuts`,
	`Beauty or Brains`,
	`Free coffee or Free Wifi`,
	`Ketchup or Mustard`,
	`Coke or Pepsi`,
	`Dogs or Cats`,
	`Kalapati or Kahit anong Ibon`,
	`Android or Iphone`,
	`Desktop or Laptop`,
	`Call or Chat`,
	`Older than you or Younger than you`,
	`Umaaraw or Umuulan`,
	`Groovy or Rythm`,
	`Mcdo or Jollibee`,
	`Torpe or Aggressive`,
	`Earphones or Headphones`,
	`Nutella or Peanut Butter`,
	`Willie Revillame or Jovit Baldivino`,
	`Early Bird or Night Owl`,
	`Beach or Mountains`,
	`Tall or Short`,
	`Coffee or Tea`,
	`Left or Right`,
	`Taylor Swift or Kuya Wil`,
	`Painting or Drawing`,
	`Mawala wallet or Mawala cellphone`,
	`Bumalik sa Past or Makita ang Future`,
	`Mawala ka or Mawala Ako`,
	`LDR; Magwowork or Hindi Magwowork`,
];

function createMessage(target) {
	return new Discord.MessageEmbed().setColor("#0099ff").setTitle(target);
}

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
