exports.run = (client, message, args) => {
	const count = +args[2] || 3;
	const max = 10;
	const potchi =
		client.emojis.cache.find((emoji) => emoji.name === "potchi") || ":smile:";

	const spiel = Array(count > max ? max : count)
		.fill()
		.map((x) => potchi)
		.join(" ");

	message.channel.send(spiel);
};

exports.help = "Summon a Potchi army";
exports.aliases = ["po"];
