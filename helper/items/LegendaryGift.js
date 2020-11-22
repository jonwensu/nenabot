const Gift = require("./Gift");

const { getEmoji, bold, pick, doRollRange } = require("../../util/formatUtil");
const {
	keys: giftKeys,
	contents: giftContents,
} = require("../../util/GiftKeys");
const maskNitro = process.env.MASK_NITRO === "true";

module.exports = class LegendaryGift extends (
	Gift
) {
	constructor(client, price, limit, rate) {
		super(
			client,
			6,
			"Legendary Gift",
			"legendary",
			getEmoji(client, "legendaryGift"),
			price,
			limit,
			`This gift is Legen... wait for it... DARY!!!\n\nSumasakit ba ulo mo kakaisip kung san gagastusin mga ${bold(
				`Potchi`
			)} mo? Bili ka nalang neto para may chance kang makakuha ng maraming ${bold(
				`Potchicket`
			)} or ${bold(maskNitro ? `Potato` : `1 Month Discord Nitro`)}!!!`,
			[giftKeys.potchicket, giftKeys.nitro],
			"https://cdn.discordapp.com/attachments/765047137473265714/777852498534203392/4-gift-legendary.png",
			rate
		);
	}

	async postValidate(message, item) {
		const failRate =
			100 -
			+Object.keys(this.rates).reduce(
				(prev, next) => +prev + this.rates[next],
				0
			);
		const r = {
			...this.rates,
			[giftKeys.potchicket]: failRate,
		};

		const pool = this.getRatePool(r);

		const roll = () => {
			const res = pick(pool);
			const givePotchicket = res === giftKeys.potchicket;
			const giveNitro = res === giftKeys.nitro;
			let giftKey = giftKeys.potchi;
			let quantity = this.potchiRoll(90);
			let qtyMessage = `${quantity} ${getEmoji(this.client, "potchi")} Potchis`;

			if (givePotchicket) {
				giftKey = giftKeys.potchicket;
				quantity = doRollRange(5, 20) + 1;
				const match = giftContents(this.client)[giftKey];
				qtyMessage = `${quantity > 1 ? quantity : "a"} ${match.icon} ${
					match.name
				}${quantity > 1 ? "s" : ""}`;
			} else if (giveNitro) {
				giftKey = giftKeys.nitro;
				quantity = 1;
				const match = giftContents(this.client)[giftKey];
				qtyMessage = `a ${match.icon} ${match.name}`;
			}
			return {
				itemId: giftContents(this.client)[giftKey].id,
				quantity,
				qtyMessage,
			};
		};

		const result = roll();
		await message.channel.send(
			`${this.openSpiel(message)}\n\nIt contained ${bold(result.qtyMessage)}`
		);

		return result;
	}
};
