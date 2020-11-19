const Gift = require("./Gift");

const { getEmoji, bold } = require("../../util/formatUtil");
const giftKeys = require("../../util/GiftKeys");

module.exports = class LegendaryGift extends Gift {
	constructor(client, price, limit) {
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
			)} or ${bold(`1 Month Discord Nitro`)}!!!`,
			[giftKeys.potchicket, giftKeys.nitro],
			"https://cdn.discordapp.com/attachments/765047137473265714/777852498534203392/4-gift-legendary.png"
		);
	}

	open(message) {
		message.channel.reply(`${this.name} opened!`);
	}
};
