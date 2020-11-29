const Gift = require("./Gift");

const { getEmoji, bold, pick, doRoll } = require("../../util/formatUtil");
const {
	keys: giftKeys,
	contents: giftContents,
} = require("../../util/GiftKeys");
const NitroService = require("../../services/NitroService");

const maskNitro = process.env.MASK_NITRO === "true";

module.exports = class EpicGift extends (
	Gift
) {
	constructor(client, price, limit, rate) {
		super(
			client,
			5,
			"Epic Gift",
			"epic",
			getEmoji(client, "epicGift"),
			price,
			limit,
			`Don't know what to pick? EPIC THIS!!\n\nKung feel mo lang naman gumastos, bili ka neto. Pwede kang makakuha ng napakaraming ${bold(
				`Potchi`
			)}. Pwede rin makakuha ng ${bold(
				`Potchicket`
			)} para sa raffle. May smol chance din na makakuha ng\n${bold(
				maskNitro ? `Potato` : `1 Month Discord Nitro`
			)}!!`,
			[giftKeys.potchi, giftKeys.potchicket, giftKeys.nitro],
			"https://cdn.discordapp.com/attachments/765047137473265714/777852487730331648/3-gift-epic.png",
			rate
		);
	}

	async postValidate(message, item) {
		const nitroService = new NitroService(this.client.database);
		const nitroPool = await nitroService.getGifts();
		const availableNitro = Object.keys(nitroPool).find(
			(k) => !nitroPool[k].owner
		);
		const ownedNitro = Object.keys(nitroPool).find(
			(k) => nitroPool[k].owner === message.author.id
		);

		const alreadyHasNitro = ownedNitro !== undefined;

		const hasAvailableNitro = availableNitro !== undefined;

		const failRate =
			100 -
			+Object.keys(this.rates).reduce(
				(prev, next) => +prev + this.rates[next],
				0
			);
		const r = {
			...this.rates,
			[giftKeys.potchi]: failRate,
		};

		const pool = this.getRatePool(r);

		const roll = async () => {
			const res = pick(pool);
			const giveNitro = res === giftKeys.nitro;
			const givePotchicket =
				(giveNitro && (!hasAvailableNitro || alreadyHasNitro)) ||
				res === giftKeys.potchicket;
			let giftKey = giftKeys.potchi;
			let quantity = this.potchiRoll(60);
			let qtyMessage = `${quantity} ${getEmoji(this.client, "potchi")} Potchis`;

			if (givePotchicket) {
				giftKey = giftKeys.potchicket;
				quantity = doRoll(5) + 1;
				const match = giftContents(this.client)[giftKey];
				qtyMessage = `${quantity > 1 ? quantity : "a"} ${match.icon} ${
					match.name
				}${quantity > 1 ? "s" : ""}`;
			} else if (giveNitro) {
				giftKey = giftKeys.nitro;
				quantity = 1;
				const match = giftContents(this.client)[giftKey];
				qtyMessage = `a ${match.icon} ${match.name}`;
				await nitroService.assignGift(availableNitro, message.author.id);
			}
			return {
				itemId: giftContents(this.client)[giftKey].id,
				quantity,
				qtyMessage,
			};
		};

		const result = await roll();
		await message.channel.send(
			`${this.openSpiel(message)}\n\nIt contained ${bold(result.qtyMessage)}`
		);

		return result;
	}
};
