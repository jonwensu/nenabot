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
		const result = await this.database
			.ref(`${this.baseRef}/gift`)
			.once("value");
		return result.val() || [];
	}

	async assign(scope, nitroId, userId) {
		await this.database
			.ref(`${this.baseRef}/${scope}/${nitroId}`)
			.update({ owner: userId });
	}

	async assignGift(nitorId, userId) {
		this.assign("gift", nitorId, userId);
	}

	async assignRaffle(nitorId, userId) {
		this.assign("raffle", nitorId, userId);
	}

	async getRaffle() {
		const result = await this.database
			.ref(`${this.baseRef}/raffle`)
			.once("value");
		return result.val() || [];
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
		const pool = all[scope];
		const ownedNitro =
			userId !== undefined &&
			Object.keys(pool).find((k) => pool[k].owner === userId);

		return ownedNitro !== undefined
			? { ...pool[ownedNitro], index: ownedNitro }
			: undefined;
	}

	async claimLinks(userId, payload, scope = "gift") {
		const match = await this.getOwnedNitro(scope, userId);

		if (match) {
			await this.database
				.ref(`${this.baseRef}/${scope}/${match.index}/links`)
				.update(payload);
		}
	}

	async getAvailableNitro(scope) {
		const all = await this.getAll();
		const pool = all[scope];
		const availableNitro = Object.keys(pool).find((k) => !pool[k].owner);

		return availableNitro !== undefined ? pool[availableNitro] : undefined;
	}
}

module.exports = NitroService;
