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
	}

	open(message) {
		message.channel.reply(`${this.name} opened!`);
	}
};
