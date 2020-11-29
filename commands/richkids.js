const InventoryService = require("../services/InventoryService");
const { mentionAuthor, createEmbedMessage } = require("../util/formatUtil");
const POTCHI_ID = 1;
exports.run = async (client, message, args) => {
	const inventoryService = new InventoryService(client.database);

	const inventories = await inventoryService.getAll();
	const allSorted = Object.keys(inventories)
		.map((id) => ({ id, quantity: inventories[id][POTCHI_ID].quantity || 0 }))
		.sort((a, b) => b.quantity - a.quantity);
	const top = allSorted.slice(0, 10);
	let description = top
		.map(
			({ id, quantity }, i) =>
				`${i + 1}. ${mentionAuthor({
					author: { id },
				})} - ${quantity.toLocaleString("en")}`
		)
		.join("\n");

	const notIncluded = !top.map(({ id }) => id).includes(message.author.id);

	if (notIncluded) {
		const ids = allSorted.map(({ id }) => id);
		const rank = ids.indexOf(message.author.id) + 1;
		const entry = allSorted.find(({ id }) => id === message.author.id);
		description += `\n\n${rank}. ${mentionAuthor(
			message
		)} - ${entry.quantity.toLocaleString("en")}`;
	}

	const response = createEmbedMessage()
		.setTitle("Mga mayayamang Ninangs at Ninongs")
		.setDescription(description);

	message.channel.send(response);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["rk"];
