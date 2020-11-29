const Gift = require("./Gift");

const {
	getEmoji,
	bold,
	rateRoll,
	doRollRange,
} = require("../../util/formatUtil");
const {
	keys: giftKeys,
	contents: giftContents,
} = require("../../util/GiftKeys");

module.exports = class CommonGift extends (
	Gift
) {
	constructor(client, price, limit, rates) {
		super(
			client,
			3,
			"Common Gift",
			"common",
			getEmoji(client, "commonGift"),
			price,
			limit,
			`Eto ang pinakamurang regalo dito. Presyong Divisoria.\n\nBilhin mo to kung kapos ka sa ${bold(
				`Potchi`
			)} para may chance na dumami.`,
			[giftKeys.potchi],
			"https://cdn.discordapp.com/attachments/765047137473265714/777852464447619073/1-gift-common.png",
			rates
		);
	}

	async postValidate(message, item) {
		const success = this.rates[giftKeys.potchi];

		const amount = this.potchiRoll(success);
		await message.channel.send(
			`${this.openSpiel(message)}\n\nIt contained ${bold(
				`${amount} ${getEmoji(this.client, "potchi")} Potchis!`
			)}`
		);

		return {
			itemId: giftContents(this.client)[giftKeys.potchi].id,
			quantity: amount,
		};
	}
};
