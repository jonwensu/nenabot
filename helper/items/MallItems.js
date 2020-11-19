const CommonGift = require("./CommonGift");
const RareGift = require("./RareGift");
const EpicGift = require("./EpicGift");
const LegendaryGift = require("./LegendaryGift");

module.exports = (client) => [
	new CommonGift(client, 200, 20),
	new RareGift(client, 350, 10),
	new EpicGift(client, 700, 5),
	new LegendaryGift(client, 1000, 2),
];
