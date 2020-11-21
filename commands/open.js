const gifts = require("../helper/items/MallItems");

exports.run = async (client, message, args) => {
	const giftName = args[2];
	const items = gifts(client);
	const match =
		giftName && items.find(({ value }) => value === giftName.toLowerCase());
	if (match) {
		await match.open(message);
	}
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["hl"];
