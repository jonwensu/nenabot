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

	async getByUserId(id) {
		const result = await this.database
			.ref(`${this.baseRef}/${id}`)
			.once("value");
		return result.val();
	}

	async save(user) {
		await this.database.ref(`${this.baseRef}/${user.id}`).set(user);
		return user;
	}

	async updateUsers(users) {
		await this.database.ref(this.baseRef).update(users);
		return users;
	}
}

module.exports = UserService;
