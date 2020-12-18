class NitroService {
	database = null;
	baseRef = "nitro";
	constructor(database) {
		this.database = database;
	}

	async getAll() {
		const result = await this.database.ref(this.baseRef).once("value");
		return result.val();
	}

	async getGifts() {
		const result = await this.getAll();
		return result ? result.filter(({ source }) => source === "GIFT") : [];
	}

	async assign(nitroId, userId) {
		await this.database
			.ref(`${this.baseRef}/${nitroId}`)
			.update({ owner: userId });
	}

	async assignGift(nitorId, userId) {
		this.assign(nitorId, userId);
	}

	async assignRaffle(nitorId, userId) {
		this.assign(nitorId, userId);
	}

	async getRaffle() {
		const result = await this.getAll();
		return result ? result.filter(({ source }) => source === "RAFFLE") : [];
	}

	async save(userId, item) {
		await this.database.ref(`${this.baseRef}/${userId}`).set(item);
		return item;
	}

	async update(payload) {
		await this.database.ref(this.baseRef).update(payload);
	}

	async getOwnedNitro(scope, userId) {
		const all = await this.getAll();
		const pool = Object.values(all).filter(({ source }) => source === scope);
		const ownedNitro = Object.values(pool).filter((n) => n.owner === userId);
		console.log("ownedNitro", ownedNitro);
		return ownedNitro;
	}

	async claimLinks(userId, nitroId) {
		await this.database
			.ref(`${this.baseRef}/${nitroId}`)
			.update({ claimed: true });
	}

	async getAvailableNitro(scope) {
		const all = await this.getAll();
		const pool = Object.values(all).filter(({ source }) => source === scope);
		const availableNitro = Object.keys(pool).find((k) => !pool[k].owner);

		return availableNitro !== undefined ? pool[availableNitro] : undefined;
	}
}

module.exports = NitroService;
