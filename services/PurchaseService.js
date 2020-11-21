module.exports = class PurchaseService {
	database = null;
	baseRef = "purchase";
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
};
