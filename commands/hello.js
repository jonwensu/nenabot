exports.run = (client, message, args) => {
	const spiel = "HELLO MGA KAPOTCHIII!!!";

	message.channel.send(spiel);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["hl"];
