class RaffleService {
	database = null;
	baseRef = "raffle";
	constructor(database) {
		this.database = database;
	}

	async getExcluded() {
		const result = await this.database
			.ref(`${this.baseRef}/excluded`)
			.once("value");
		return result.val() || [];
	}

	async exclude(id) {
		const curr = await this.getExcluded();
		if (!curr.includes(id)) {
			curr.push(id);
			await this.database.ref(`${this.baseRef}/excluded`).set(curr);
		}
	}

	async save(userId, item) {
		await this.database.ref(`${this.baseRef}/${userId}`).set(item);
		return item;
	}

	async update(payload) {
		await this.database.ref(this.baseRef).update(payload);
	}
}

module.exports = RaffleService;
