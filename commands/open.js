const gifts = require("../helper/items/MallItems");

const { ALLOW_OPEN_GIFT, OWNER_ID } = process.env;

exports.run = async (client, message, args) => {
	const canOpenGift =
		ALLOW_OPEN_GIFT === "true" || OWNER_ID === message.author.id;

	if (canOpenGift) {
		const giftName = args[2];
		const items = gifts(client);
		const match =
			giftName && items.find(({ value }) => value === giftName.toLowerCase());
		if (match) {
			await match.open(message);
		}
	}
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["op"];
