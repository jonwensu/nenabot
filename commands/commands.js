exports.run = (client, message, args) => {
	console.log(client.commands);

	const filtered = Object.keys(client.commands).filter(
		(c) => !client.commands[c].hidden
	);

	message.channel.send(
		`Commands: \`${process.env.BOT_PREFIX}` +
			filtered.join(`\`, \`${process.env.BOT_PREFIX}`) +
			"`"
	);
};

exports.help = "Displays a list of available commands.";
exports.aliases = ["commandlist", "command"];
