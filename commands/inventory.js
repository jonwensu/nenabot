const InventoryService = require("../services/InventoryService");
const ItemService = require("../services/ItemService");
const {
	createEmbedMessage,
	getEmoji,
	bold,
	italic,
} = require("../util/formatUtil");

exports.run = async (client, message, args) => {
	const inventoryService = new InventoryService(client.database);
	const isDM = message.channel.type === "dm";

	const sendMsg = async (m) => {
		if (isDM) {
			await message.reply(m);
		} else {
			await message.author.send(m);
		}
	};
	console.log(message.author.id);
	const inv = await inventoryService.getByUserId(message.author.id);
	if (!inv) {
		await sendMsg("WALANG LAMAN INVENTORY MO MAMIII");
	} else {
		const itemService = new ItemService(client.database);
		const items = await itemService.getAll();

		const fields = Object.keys(inv)
			.map((k) => inv[k])
			.filter(({ quantity }) => quantity > 0)
			.map((ii) => ({
				...ii,
				item: items[ii.itemId],
			}))
			.map(
				({ item: { name, icon, native }, quantity }) =>
					`${icon ? `${native ? icon : getEmoji(client, icon)}  ` : ""}${italic(
						name
					)} ─ ${bold((+quantity).toLocaleString("en"))}`
			)
			.join("\n\n");
		const embed = createEmbedMessage()
			.setAuthor(`Inventory ni ${message.author.username}`.toUpperCase())
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/765047137473265714/774519411612581898/chest.jpg"
			)
			.setDescription(fields);
		await sendMsg(embed);
	}
	if (!isDM) {
		message.delete();
	}
};

exports.help = "Send a DM of your inventory";
exports.aliases = ["inv"];
