const InventoryService = require("../services/InventoryService");
const ItemService = require("../services/ItemService");
const {
	createEmbedMessage,
	getEmoji,
	bold,
	italic,
	mentionAuthor,
} = require("../util/formatUtil");

exports.run = async (client, message, args) => {
	const isDm = message.channel.type === "dm";
	const mention = !isDm && message.mentions.members.first();

	const target = mention ? mention.user : message.author;
	const targetId = target.id;
	const isOwnInventory = targetId === message.author.id;
	const inventoryService = new InventoryService(client.database);

	const inv = await inventoryService.getByUserId(targetId);

	const sendMsg = async (m, spiel, dm) => {
		if (dm) {
			await m.author.send(spiel);
		} else {
			await m.reply(spiel);
		}
	};
	if (!inv) {
		const mm = mention
			? `NI ${mentionAuthor({ author: { id: targetId } })}`
			: "MO";
		await sendMsg(`WALANG LAMAN INVENTORY ${mm} MAMIII`, isOwnInventory);
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
			.setAuthor(`Inventory ni ${target.username}`.toUpperCase())
			.setThumbnail(
				"https://cdn.discordapp.com/attachments/765047137473265714/774519411612581898/chest.jpg"
			)
			.setDescription(fields);
		await sendMsg(message, embed, isOwnInventory);
	}

	if (isOwnInventory && !isDm) {
		message.delete();
	}
};

exports.help = "Send a DM of your inventory";
exports.aliases = ["inv"];
