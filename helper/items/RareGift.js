const Gift = require("./Gift");

const { getEmoji, bold } = require("../../util/formatUtil");
const giftKeys = require("../../util/GiftKeys");

module.exports = class rareGift extends Gift {
	constructor(client, price, limit) {
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
			"https://cdn.discordapp.com/attachments/765047137473265714/777852476278833192/2-gift-rare.png"
		);
	}

	open(message) {
		message.reply(`${this.name} opened!`);
	}
};
