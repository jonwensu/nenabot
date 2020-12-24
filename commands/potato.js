const { mentionAuthor } = require("../util/formatUtil");
const UserService = require("../services/UserService");
const NitroService = require("../services/NitroService");
const InventoryService = require("../services/InventoryService");
const { keys: giftKeys, contents: giftContents } = require("../util/GiftKeys");

exports.run = async (client, message, args) => {
	const [_, __, user, qq] = args;
	const POTATO_ID = 9;

	const qty = qq || 1;

	let quantity = 1;

	let response = "";

	const inventoryService = new InventoryService(client.database);
	const nitroService = new NitroService(client.database);
	const inventories = await inventoryService.getAll();
	const sourceInventory = inventories[message.author.id];
	let allowTransfer = true;

	if (sourceInventory) {
		quantity = qty === "all" ? +sourceInventory[POTATO_ID].quantity : +qty;
		const hasEnoughQty =
			sourceInventory[POTATO_ID] &&
			+sourceInventory[POTATO_ID].quantity >= +quantity;

		if (!hasEnoughQty) {
			allowTransfer = false;
		}
	} else {
		allowTransfer = false;
	}

	if (allowTransfer) {
		const emptyEntry = {
			itemId: POTATO_ID,
			quantity: 0,
		};
		const sourcePotchiEntry = sourceInventory[POTATO_ID] || {
			...emptyEntry,
		};

		const sourceInventoryUpdate = {
			...sourceInventory,
			[POTATO_ID]: {
				...sourcePotchiEntry,
				quantity: +sourcePotchiEntry.quantity - +quantity,
			},
		};

		const updates = {
			[message.author.id]: sourceInventoryUpdate,
		};

		const inviteUrl = "https://discord.gg/udzJtYEdcc";
		response = `${mentionAuthor(
			message
		)}, you have been invited to a very exclusive server. Please accept the invitation to see what's in store for you over there.\n\n${inviteUrl}`;

		await inventoryService.update(updates);
	} else {
		response = `${mentionAuthor(
			message
		)}, you do not have any Potatoes in your inventory`;
	}

	message.channel.send(response);
};

exports.help = "Give Nitro to another User";
exports.aliases = ["nt"];
