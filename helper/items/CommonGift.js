const Gift = require("./Gift");

const { getEmoji, bold } = require("../../util/formatUtil");
const giftKeys = require("../../util/GiftKeys");

module.exports = class EpicGift extends Gift {
	constructor(client, price, limit) {
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
			"https://cdn.discordapp.com/attachments/765047137473265714/777852464447619073/1-gift-common.png"
		);
	}

	async postValidate(message) {
		await message.reply(`${this.name} opened! mamiii`);
	}
};
