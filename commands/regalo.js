const Discord = require("discord.js");

const { gifts, run: showGifts } = require("./mall");
const InventoryService = require("../services/InventoryService");
const PurchaseService = require("../services/PurchaseService");

const POTCHI_ID = 1;

const {
	bold,
	mentionAuthor,
	doRoll,
	pick,
	shuffle,
} = require("../util/formatUtil");

exports.run = async (client, message, args) => {
	const choice = args[2];
	const shop = gifts(client);

	const gift =
		choice && shop.find(({ value }) => value === choice.toLowerCase());

	if (!choice || !gift) {
		showGifts(client, message, args);
	} else {
		let quantity = !isNaN(args[3]) ? args[3] || 1 : 1;

		const inventoryService = new InventoryService(client.database);
		const purchaseService = new PurchaseService(client.database);

		const purchaseHistory = await purchaseService.getByUserId(
			message.author.id
		);

		const purchaseCount =
			purchaseHistory && purchaseHistory[gift.value]
				? purchaseHistory[gift.value].count || 0
				: 0;
		let spiel = "";
		if (purchaseCount >= gift.limit) {
			spiel = `${mentionAuthor(
				message
			)}, you already reached the purchasing limit for the ${bold(gift.name)}.`;
		} else {
			quantity =
				+quantity + +purchaseCount > +gift.limit
					? +gift.limit - +purchaseCount
					: quantity;
			const vowels = ["a", "e", "i", "o", "u"];
			const inventory = await inventoryService.getByUserId(message.author.id);
			console.log(typeof inventory);
			const article = (name) =>
				vowels.includes(name.toLowerCase()[0]) ? "an" : "a";
			const normalizeQty = (qty, name) => (qty === 1 ? article(name) : qty);
			const pluralize = (qty, word) => (qty === 1 ? word : `${word}s`);
			const potchi = Object.keys(inventory)
				.filter((i) => i)
				.map((k) => inventory[k])
				.find((item) => item.itemId === POTCHI_ID);

			const total = +gift.price * +quantity;
			const remaining = +potchi.quantity - +total;

			const canAfford = remaining >= 0;

			spiel = `${mentionAuthor(message)}, you bought ${normalizeQty(
				quantity,
				gift.name
			)} ${pluralize(
				quantity,
				gift.name
			)} for ${total} Potchis. You now have ${remaining} ${pluralize(
				remaining,
				"Potchi"
			)} left.`;

			if (!canAfford) {
				spiel = `${mentionAuthor(
					message
				)}, you do not have enough Potchis to buy ${normalizeQty(
					quantity
				)} ${bold(pluralize(quantity, pluralize(quantity, gift.name)))}`;
			} else {
				const inventory = await inventoryService.getByUserId(message.author.id);
				const entry = inventory[gift.id] || {
					itemId: gift.id,
					quantity: 0,
				};
				const inventoryUpdate = {
					[gift.id]: {
						...entry,
						quantity: +quantity + +entry.quantity,
					},
					[POTCHI_ID]: {
						...inventory[POTCHI_ID],
						quantity: remaining,
					},
				};

				inventory;
				await inventoryService.updateRef(
					message.author.id,
					"",
					inventoryUpdate
				);
				purchaseService.updateRef(message.author.id, `/${gift.value}`, {
					count: +purchaseCount + +quantity,
				});
			}
		}
		message.channel.send(spiel);
	}
};

exports.help = `Just an example command. Usage: \`${process.env.BOT_PREFIX}example\``;
exports.aliases = ["rg"];
