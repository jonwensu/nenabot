exports.run = async (client, message, args) => {
	const BEER_ICON = "🍺";
	const {
		author: { id: authorId },
	} = message;
	message.delete();
	const m = await message.channel.send(`tara shot @everyone`);
	await m.react(BEER_ICON);
	const filter = (reaction, user) => {
		return [BEER_ICON].includes(reaction.emoji.name);
	};

	const collector = m.createReactionCollector(filter, {
		time: 60000,
	});

	collector.on("collect", (reaction) => {
		// console.log(m.content);
		if (reaction.emoji.name === BEER_ICON) {
			m.channel.send(`<@${authorId}> you reacted with a thumbs up.`);
		}
	});

	// collector.on("end", (collected) => {
	// 	console.log(`Collected ${collected.size} items`);
	// });
};

exports.help = `Just an example command. Usage: ${process.env.BOT_PREFIX}example`;
exports.aliases = ["shot", "tagay"];
