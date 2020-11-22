const InventoryService = require("../../services/InventoryService");
const {
	mentionAuthor,
	bold,
	rateRoll,
	doRollRange,
} = require("../../util/formatUtil");
const { contents } = require("../../util/GiftKeys");
module.exports = class Gift {
	constructor(
		client,
		id,
		name,
		value,
		icon,
		price,
		limit,
		description,
		contents,
		url,
		rates
	) {
		this.client = client;
		this.id = id;
		this.name = name;
		this.value = value;
		this.icon = icon;
		this.price = price;
		this.limit = limit;
		this.description = description;
		this.contents = contents;
		this.url = url;
		this.rates = rates;
		this.inventoryService = new InventoryService(client.database);
	}

	getRatePool(map) {
		return Object.keys(map).reduce(
			(prev, next) =>
				prev.concat(
					Array(+map[next])
						.fill()
						.map(() => next)
				),
			[]
		);
	}

	async validate(message, item) {
		if (item && item.quantity > 0) return true;

		return false;
	}
	async postValidate(message, item) {
		await message.channel.send(this.openSpiel(message));
	}

	async _removeFromInventory(userId, item) {
		await this.inventoryService.updateRef(userId, `/${item.itemId}`, {
			quantity: +item.quantity - 1,
		});
	}

	getIconName() {
		return bold(`${this.icon} ${this.name}`);
	}

	potchiRoll(rate, multiplier) {
		const mul = multiplier || this.price;
		const bigDrop = rateRoll(rate);
		let min = Math.floor(+this.price / 2);
		let max = this.price;
		if (bigDrop) {
			min = Math.floor(+mul * 1.25);
			max = Math.floor(+mul * 1.5);
		}

		return doRollRange(min, max) + 1;
	}

	openSpiel(message) {
		const vowels = ["a", "e", "i", "o", "u"];
		const article = vowels.includes(this.name.toLowerCase()[0]) ? "an" : "a";
		return `${mentionAuthor(
			message
		)} opened ${article} ${this.getIconName()}...`;
	}

	async open(message) {
		const inventory = await this.inventoryService.getByUserId(
			message.author.id
		);
		const item = inventory[this.id];
		if (await this.validate(message, item)) {
			const content = await this.postValidate(message, item);
			await this._removeFromInventory(message.author.id, item);
			const qty = (content && content.itemId && content.quantity) || 0;

			const entry = inventory[content.itemId] || {
				itemId: content.itemId,
				quantity: 0,
			};

			const itemUpdate = {
				...entry,
				quantity: +entry.quantity + +qty,
			};

			await this.inventoryService.updateRef(
				message.author.id,
				`/${content.itemId}`,
				itemUpdate
			);
		} else {
			await message.channel.send(
				`${mentionAuthor(message)}, you do not have any ${
					this.name
				} in your inventory`
			);
		}
	}
};
