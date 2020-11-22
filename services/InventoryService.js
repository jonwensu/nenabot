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

	async getByUserId(userId, ref = false) {
		const result = await this.database
			.ref(`${this.baseRef}/${userId}`)
			.once("value");

		if (ref) {
			return result;
		}

		return result.val();
	}

	async save(userId, item) {
		await this.database.ref(`${this.baseRef}/${userId}`).set(item);
		return item;
	}

	async update(payload) {
		await this.database.ref(this.baseRef).update(payload);
	}

	async updateRef(userId, ref, payload) {
		await this.database.ref(`${this.baseRef}/${userId}/${ref}`).update(payload);
	}

	async saveRef(userId, payload) {
		await this.database.ref(`${this.baseRef}/${userId}`).update(payload);
	}
}

module.exports = InventoryService;
