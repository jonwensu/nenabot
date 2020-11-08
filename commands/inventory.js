const InventoryService = require("../services/InventoryService");
const ItemService = require("../services/ItemService");
const { createEmbedMessage } = require("../util/formatUtil");

exports.run = async (client, message, args) => {
	const inventoryService = new InventoryService(client.database);
	const potchi =
		client.emojis.cache.find((emoji) => emoji.id === "potchi") || "";
	const isDM = message.type === "dm";

	const sendMsg = async (m) => {
		if (isDM) {
			await message.reply(m);
		} else {
			await message.author.send(m);
		}
	};
	const inv = await inventoryService.getByUserId(message.author.id);
	if (!inv) {
		await sendMsg("WALANG LAMAN INVENTORY MO MAMIII");
	} else {
		const itemService = new ItemService(client.database);
		const items = await itemService.getAll();

		const fields = inv
			.map((ii) => ({
				...ii,
				item: items[ii.itemId],
			}))
			.map(({ item: { name }, quantity }) => ({
				name: name,
				value: `${potchi} ${quantity}`,
			}));
		const embed = createEmbedMessage()
			.setAuthor(
				"Inventory",
				"https://cdn.discordapp.com/attachments/765047137473265714/774519411612581898/chest.jpg"
			)
			.addFields(fields);
		await sendMsg(embed);
	}
	if (!isDM) {
		message.delete();
	}
};

exports.help = "Send a DM of your inventory";
exports.aliases = ["inv"];