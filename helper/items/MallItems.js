const CommonGift = require("./CommonGift");
const RareGift = require("./RareGift");
const EpicGift = require("./EpicGift");
const LegendaryGift = require("./LegendaryGift");
const { keys: giftKeys } = require("../../util/GiftKeys");
const Nitro = require("./Nitro");

module.exports = (client) => [
	new CommonGift(client, 200, 20, { [giftKeys.potchi]: 75 }),
	new RareGift(client, 350, 10, { [giftKeys.potchicket]: 5 }),
	new EpicGift(client, 700, 5, {
		[giftKeys.potchicket]: 10,
		[giftKeys.nitro]: 5,
	}),
	new LegendaryGift(client, 1000, 2, {
		[giftKeys.nitro]: 10,
	}),
	new Nitro(client),
];
