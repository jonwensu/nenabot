const Discord = require("discord.js");
const giftKeys = require("../util/GiftKeys");

const {
	bold,
	getEmoji,
	italic,
	code,
	createEmbedMessage,
} = require("../util/formatUtil");
const CommonGift = require("../helper/items/CommonGift");
const RareGift = require("../helper/items/RareGift");
const EpicGift = require("../helper/items/EpicGift");
const LegendaryGift = require("../helper/items/LegendaryGift");

const { MALL_HIDE_PRICE } = process.env;

const HIDE_PRICE = MALL_HIDE_PRICE === "true";

const giftContents = (client) => ({
	[giftKeys.potchi]: {
		name: "Potchi",
		icon: getEmoji(client, "potchi"),
	},
	[giftKeys.potchicket]: {
		name: "Potchicket",
		icon: "🎟️",
	},
	[giftKeys.nitro]: {
		name: "Discord Nitro",
		icon: getEmoji(client, "pnitro"),
	},
});

const kk = Object.values(giftKeys);

const items = (client) => [
	new CommonGift(client, 200, 20),
	new RareGift(client, 350, 10),
	new EpicGift(client, 700, 5),
	new LegendaryGift(client, 1000, 2),
];

exports.run = (client, message, args) => {
	const [arg1, arg2, ...restArgs] = args;
	const isDescribe =
		restArgs.length > 0
			? restArgs.map((r) => r.trim().toLowerCase()).join(" ")
			: null;

	let spiel = new Discord.MessageEmbed()
		.setColor("#0099ff")
		.setTitle("Potchi Mall")
		.setDescription(
			`${bold(`Potchis`)} will be used to purchase the following items:`
		)
		.setThumbnail(
			"https://cdn.discordapp.com/icons/749742356466761922/73a5e5150238a0af17992739d9346641.webp"
		)
		.addFields(
			...items(client).map(({ name, value, price, limit, icon }) => ({
				name: `${icon} ${name} ─ ${HIDE_PRICE ? "???" : price}`,
				value: italic(
					`ID: ${code(value)}\nPurchase Limit: ${
						HIDE_PRICE ? "???" : bold(limit)
					}`
				),
				inline: false,
			}))
		)
		.setFooter(
			HIDE_PRICE ? "" : `Type ${process.env.BOT_PREFIX}pabili <item ID> to buy`
		);

	if (isDescribe) {
		const match = items(client).find(
			({ value }) => value === restArgs.join(" ").toLowerCase()
		);

		if (match) {
			const arr = [
				`${bold(`Price: ${match.price}`)}`,
				italic(match.description),
				`${bold(
					`Possible Contents: ${match.contents
						.map((k) => giftContents(client)[k].icon)
						.join(" ")}`
				)}`,
			];
			spiel = createEmbedMessage()
				.setTitle(match.name)
				.setDescription(arr.join("\n\n"))
				.setThumbnail(match.url);
		}
	}

	message.channel.send(spiel);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["pm"];

exports.gifts = items;
exports.giftKeys = giftKeys;
