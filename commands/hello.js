exports.run = (client, message, args) => {
	const potchi =
		client.emojis.cache.find((emoji) => emoji.name === "potchi") || "";
	const spiel = `HELLO MGA KAPOTCHIII!!! ${potchi} ${potchi} ${potchi}`.trim();

	message.channel.send(spiel);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["hl"];
