const Gift = require("./Gift");

const { getEmoji, bold } = require("../../util/formatUtil");
const giftKeys = require("../../util/GiftKeys");

module.exports = class EpicGift extends Gift {
	constructor(client, price, limit) {
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
				`1 Month Discord Nitro`
			)}!!`,
			[giftKeys.potchi, giftKeys.potchicket, giftKeys.nitro],
			"https://cdn.discordapp.com/attachments/765047137473265714/777852487730331648/3-gift-epic.png"
		);
	}

	open(message) {
		message.reply(`${this.name} opened!`);
	}
};
