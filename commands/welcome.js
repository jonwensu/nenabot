exports.run = (client, message, args) => {
	const spiel = "WELCOME MGA KAPOTCHIII!!! SANA DI KAYO MAGING INACTIVE!!!";

	message.channel.send(spiel);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["wc"];
