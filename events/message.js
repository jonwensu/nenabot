module.exports = (client, message) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(process.env.BOT_PREFIX)) return;

	var cmd = message.content.toLowerCase().trim();
	var args = cmd
		.match(/"[^"]*"|\S+/g)
		.map((m) => (m.slice(0, 1) === '"' ? m.slice(1, -1) : m));
	const prefix = process.env.BOT_PREFIX.toLowerCase();
	try {
		for (var i in client.commands) {
			if (cmd.startsWith(prefix + i)) {
				client.commands[i].run(client, message, args);
				break;
			} else {
				if (client.commands[i].aliases) {
					if (client.commands[i].aliases.includes(args[0].split(prefix)[1])) {
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
