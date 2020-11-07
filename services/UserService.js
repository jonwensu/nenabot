class UserService {
	baseRef = "users";
	database = null;
	constructor(database) {
		this.database = database;
	}

	async getAll() {
		const result = await this.database.ref(this.baseRef).once("value");
		return result.val();
	}

	async save(user, update = false) {
		await this.database.ref(`${this.baseRef}/${user.id}`).set(user);
		return user;
	}
}

module.exports = UserService;
