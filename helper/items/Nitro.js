const Gift = require("./Gift");

const { getEmoji, bold } = require("../../util/formatUtil");
const NitroService = require("../../services/NitroService");
const InventoryService = require("../../services/InventoryService");

module.exports = class Nitro extends (
	Gift
) {
	constructor(client) {
		super(
			client,
			8,
			"Discord Nitro",
			"nitro",
			getEmoji(client, "pnitro"),
			0,
			0,
			`1 Month Classic Nitro Subscription`,
			[],
			"https://cdn.discordapp.com/attachments/765047137473265714/784401434681671680/nitro_classic_logo.png",
			{},
			true
		);
	}

	async postValidate(message, item) {
		const inventoryService = new InventoryService(this.client.database);
		const nitroService = new NitroService(this.client.database);
		const inventory = await inventoryService.getByUserId(message.author.id);
		const ownedNitro = await nitroService.getOwnedNitro(
			"GIFT",
			message.author.id
		);
		const nitro = inventory[this.id] || { itemId: this.id, quantity: 0 };
		const hasNitro = nitro.quantity > 0 && ownedNitro.length > 0;

		if (hasNitro) {
			await message.react(this.icon);
			const unclaimedNitro = ownedNitro.filter((n) => !n.claimed);

			if (unclaimedNitro.length > 0) {
				const nitro = unclaimedNitro[0];
				await nitroService.claimLinks(message.author.id, nitro.id);
				await message.author.send(
					`Congrats MAMIII!!! Claim mo kaagad to bago mag expire!\n\n${nitro.link}`
				);
				if (message.channel.type !== "dm") {
					await message.reply("DM sent MAMIII!");
				}
			} else {
				await message.reply("You already claimed all your Nitros");
			}
		} else {
			await message.channel.send(
				`You do not have any ${bold(`Nitro`)} in your inventory`
			);
		}

		return null;
	}
};
