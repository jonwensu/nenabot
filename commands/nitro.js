const { mentionAuthor } = require("../util/formatUtil");
const UserService = require("../services/UserService");
const NitroService = require("../services/NitroService");
const InventoryService = require("../services/InventoryService");
const { keys: giftKeys, contents: giftContents } = require("../util/GiftKeys");

exports.run = async (client, message, args) => {
	const [_, __, user, qq] = args;
	const NITRO = giftContents(client)[giftKeys.nitro];
	const NITRO_ID = NITRO.id;

	const target = message.mentions.members.first();
	const qty = qq || 1;

	const allArgsAvailable = [qty, target].every((e) => e !== undefined);

	let quantity = 1;

	let response = "";

	if (allArgsAvailable) {
		const validQuantity = !isNaN(qty)
			? qty > 0
			: qty && qty.toLowerCase() === "all";

		if (validQuantity) {
			const inventoryService = new InventoryService(client.database);
			const nitroService = new NitroService(client.database);
			const inventories = await inventoryService.getAll();
			const sourceInventory = inventories[message.author.id];
			const targetInventory = inventories[target.user.id] || {};
			let allowTransfer = true;

			const ownedNitros = await nitroService.getOwnedNitro(
				"GIFT",
				message.author.id
			);
			const unclaimedOwnedNitros = ownedNitros.filter((a) => !a.claimed);

			if (sourceInventory) {
				quantity = qty === "all" ? +sourceInventory[NITRO_ID].quantity : +qty;
				const hasEnoughQty =
					sourceInventory[NITRO_ID] &&
					+sourceInventory[NITRO_ID].quantity >= +quantity &&
					unclaimedOwnedNitros;

				if (!hasEnoughQty) {
					allowTransfer = false;
				}
			} else {
				allowTransfer = false;
			}

			if (allowTransfer) {
				const activeNitro = unclaimedOwnedNitros[0];
				await nitroService.assignGift(activeNitro.id, target.user.id);
				const emptyEntry = {
					itemId: NITRO_ID,
					quantity: 0,
				};
				const sourcePotchiEntry = sourceInventory[NITRO_ID] || {
					...emptyEntry,
				};
				const targetPotchiEntry = targetInventory[NITRO_ID] || {
					...emptyEntry,
				};

				const sourceInventoryUpdate = {
					...sourceInventory,
					[NITRO_ID]: {
						...sourcePotchiEntry,
						quantity: +sourcePotchiEntry.quantity - +quantity,
					},
				};
				const targetInventoryUpdate = {
					...targetInventory,
					[NITRO_ID]: {
						...targetPotchiEntry,
						quantity: +targetPotchiEntry.quantity + +quantity,
					},
				};

				const updates = {
					[message.author.id]: sourceInventoryUpdate,
					[target.user.id]: targetInventoryUpdate,
				};

				response = `${mentionAuthor(message)} gave ${(+quantity).toLocaleString(
					"en"
				)} ${NITRO.icon} Nitro${quantity != 1 ? "s" : ""} to ${mentionAuthor({
					author: target.user,
				})}`;

				await inventoryService.update(updates);
			} else {
				response = `${mentionAuthor(
					message
				)}, you do not have enough Nitro in your inventory`;
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
				"`" + process.env.BOT_PREFIX + "nitro <mention user>`"
			}`
		);
	}
};

exports.help = "Give Nitro to another User";
exports.aliases = ["nt"];
