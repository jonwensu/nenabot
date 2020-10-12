exports.run = (client, message, args) => {
	const potchi =
		client.emojis.cache.find((emoji) => emoji.name === "potchi") || "";
	const spiel = `WELCOME MGA KAPOTCHIII!!! SANA DI KAYO MAGING INACTIVE!!! ${potchi} ${potchi} ${potchi}`.trim();

	message.channel.send(spiel);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["wc"];
