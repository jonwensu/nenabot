const { mentionAuthor } = require("../util/formatUtil");
const UserService = require("../services/UserService");
const InventoryService = require("../services/InventoryService");
const { keys: giftKeys, contents: giftContents } = require("../util/GiftKeys");

const POTCHI_ID = 1;

exports.run = async (client, message, args) => {
	const [_, __, qty] = args;
	const target = message.mentions.members.first();

	const allArgsAvailable = [qty, target].every((e) => e !== undefined);

	let quantity = 0;

	let response = "";

	if (allArgsAvailable) {
		const validQuantity = !isNaN(qty)
			? qty > 0
			: qty && qty.toLowerCase() === "all";

		if (validQuantity) {
			const inventoryService = new InventoryService(client.database);
			const inventories = await inventoryService.getAll();
			const sourceInventory = inventories[message.author.id];
			const targetInventory = inventories[target.user.id] || {};
			let allowTransfer = true;

			if (sourceInventory) {
				quantity = qty === "all" ? +sourceInventory[POTCHI_ID].quantity : +qty;
				const hasEnoughQty =
					sourceInventory[POTCHI_ID] &&
					+sourceInventory[POTCHI_ID].quantity >= +quantity;

				if (!hasEnoughQty) {
					allowTransfer = false;
				}
			} else {
				allowTransfer = false;
			}

			if (allowTransfer) {
				const emptyEntry = {
					itemId: POTCHI_ID,
					quantity: 0,
				};
				const sourcePotchiEntry = sourceInventory[POTCHI_ID] || {
					...emptyEntry,
				};
				const targetPotchiEntry = targetInventory[POTCHI_ID] || {
					...emptyEntry,
				};

				const sourceInventoryUpdate = {
					...sourceInventory,
					[POTCHI_ID]: {
						...sourcePotchiEntry,
						quantity: +sourcePotchiEntry.quantity - +quantity,
					},
				};
				const targetInventoryUpdate = {
					...targetInventory,
					[POTCHI_ID]: {
						...targetPotchiEntry,
						quantity: +targetPotchiEntry.quantity + +quantity,
					},
				};

				const updates = {
					[message.author.id]: sourceInventoryUpdate,
					[target.user.id]: targetInventoryUpdate,
				};

				console.log("updates", updates);

				response = `${mentionAuthor(message)} gave ${(+quantity).toLocaleString(
					"en"
				)} Potchis to ${mentionAuthor({
					author: target.user,
				})}`;

				await inventoryService.update(updates);
			} else {
				response = `${mentionAuthor(
					message
				)}, you do not have ${(+quantity).toLocaleString(
					"en"
				)} Potchis in your inventory`;
			}

			message.channel.send(response);
		} else {
			message.channel.send(
				`${mentionAuthor(message)}, please provide a valid quantity`
			);
		}
	} else {
		message.channel.send(
			`${mentionAuthor(message)}, please use the following format: ${
				"`" + process.env.BOT_PREFIX + "give <quantity> <mention user>`"
			}`
		);
	}
};

exports.help = "Transfer Potchi to another User";
exports.aliases = ["gv"];
