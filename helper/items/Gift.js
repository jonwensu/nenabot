const InventoryService = require("../../services/InventoryService");
const { mentionAuthor, bold } = require("../../util/formatUtil");
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
		url
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
		this.inventoryService = new InventoryService(client.database);
	}

	async validate(message, item) {
		if (item && item.quantity > 0) return true;

		return false;
	}
	async postValidate(message, item) {}

	async _removeFromInventory(userId, item) {
		await this.inventoryService.updateRef(userId, `/${item.itemId}`, {
			quantity: +item.quantity - 1,
		});
	}

	async open(message) {
		const inventory = await this.inventoryService.getByUserId(
			message.author.id
		);
		const item = inventory[this.id];
		if (await this.validate(message, item)) {
			await message.reply(`Opening ${bold(`${this.icon} ${this.name}`)}...`);
			await this.postValidate(message, item);
			await this._removeFromInventory(message.author.id, item);
		} else {
			await message.reply(
				`${mentionAuthor(message)}, you do not have any ${
					this.name
				} in your inventory`
			);
		}
	}
};
