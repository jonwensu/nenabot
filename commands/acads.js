exports.run = (client, message, args) => {
	const spiel = `BRB ACADS MUNA AKO MAMIII
https://tenor.com/view/bye-slide-baby-later-peace-out-gif-12999722
`;

	message.channel.send(spiel);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["ac"];
