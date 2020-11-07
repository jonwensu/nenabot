class InventoryService {
	database = null;
	baseRef = "inventory";
	constructor(database) {
		this.database = database;
	}

	async getAll() {
		const result = await this.database.ref(this.baseRef).once("value");
		return result.val();
	}

	async getByUserId(userId) {
		const result = await this.database
			.ref(`${this.baseRef}/${userId}`)
			.once("value");
		return result.val();
	}

	async save(userId, item) {
		await this.database.ref(`${this.baseRef}/${userId}`).set(item);
		return item;
	}

	async update(payload) {
		await this.database.ref(this.baseRef).update(payload);
	}
}

module.exports = InventoryService;
