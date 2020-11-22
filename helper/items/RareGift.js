const Gift = require("./Gift");

const { getEmoji, bold, rateRoll, pick } = require("../../util/formatUtil");
const {
	keys: giftKeys,
	contents: giftContents,
} = require("../../util/GiftKeys");

module.exports = class RareGift extends (
	Gift
) {
	constructor(client, price, limit, rate) {
		super(
			client,
			4,
			"Rare Gift",
			"rare",
			getEmoji(client, "rareGift"),
			price,
			limit,
			`Ano sabi ng Lion? ${bold("Rare!")} kbye...\n\nParang ${bold(
				`Common Gift`
			)} din pero bukod sa ${bold(
				`Potchi`
			)}, may chance din na makakuha ng ${bold(`Potchicket`)}.`,
			[giftKeys.potchi, giftKeys.potchicket],
			"https://cdn.discordapp.com/attachments/765047137473265714/777852476278833192/2-gift-rare.png",
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
			[giftKeys.potchi]: failRate,
		};

		const pool = this.getRatePool(r);

		const roll = () => {
			const givePotchicket = pick(pool) === giftKeys.potchicket;
			let giftKey = giftKeys.potchi;
			let quantity = this.potchiRoll(80);
			let qtyMessage = `${quantity} ${getEmoji(this.client, "potchi")} Potchis`;

			if (givePotchicket) {
				giftKey = giftKeys.potchicket;
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
