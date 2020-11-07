module.exports = (client, message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(process.env.BOT_PREFIX)) return;

	const cmd = message.content.toLowerCase().trim();
	const args = cmd
		.match(/"[^"]*"|\S+/g)
		.map((m) => (m.slice(0, 1) === '"' ? m.slice(1, -1) : m));
	const prefix = process.env.BOT_PREFIX.toLowerCase();
	try {
		for (const i in client.commands) {
			if (cmd.startsWith(prefix + i)) {
				client.commands[i].run(client, message, args);
				break;
			} else {
				if (client.commands[i].aliases) {
					const aliasCmd = args[1];
					if (client.commands[i].aliases.includes(aliasCmd)) {
						client.commands[i].run(client, message, args);
						break;
					}
				}
			}
		}
	} catch (err) {
		console.log(err);
	}
};
