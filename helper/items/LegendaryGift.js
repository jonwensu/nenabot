const Gift = require("./Gift");

const {
	getEmoji,
	bold,
	pick,
	doRollRange,
	mentionAuthor,
} = require("../../util/formatUtil");
const {
	keys: giftKeys,
	contents: giftContents,
} = require("../../util/GiftKeys");
const NitroService = require("../../services/NitroService");
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

		const nitroService = new NitroService(this.client.database);
		const nitroPool = await nitroService.getGifts();
		const availableNitro = Object.keys(nitroPool).find(
			(k) => !nitroPool[k].owner
		);
		const ownedNitro = Object.keys(nitroPool).find(
			(k) => nitroPool[k].owner === message.author.id
		);

		const alreadyHasNitro = ownedNitro !== undefined;

		const hasAvailableNitro = availableNitro !== undefined;

		const roll = async () => {
			const res = pick(pool);
			const giveNitro = res === giftKeys.nitro;
			const givePotchicket =
				(giveNitro && (!hasAvailableNitro || alreadyHasNitro)) ||
				res === giftKeys.potchicket;
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
				await nitroService.assignGift(availableNitro, message.author.id);
				const partyFrog = getEmoji(this.client, "partyFrog");
				await this.broadcast(
					`NITRO OBTAINED!!!`,
					`${mentionAuthor(message)} opened a ${bold(
						this.name
					)} and it contained a ${bold(
						`1 Month Discord Nitro Classic Subscription`
					)}! ${partyFrog} ${partyFrog} ${partyFrog}`
				);
			}
			return {
				itemId: giftContents(this.client)[giftKey].id,
				quantity,
				qtyMessage,
			};
		};

		const result = await roll();

		if (giftContents(this.client)[giftKeys.nitro].id === result.itemId) {
		}

		await message.channel.send(
			`${this.openSpiel(message)}\n\nIt contained ${bold(result.qtyMessage)}`
		);

		return result;
	}
};
