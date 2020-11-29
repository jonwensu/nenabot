const UserService = require("../services/UserService");
const InventoryService = require("../services/InventoryService");
const RaffleService = require("../services/RaffleService");
const NitroService = require("../services/NitroService");
const {
	mentionAuthor,
	getEmoji,
	shuffle,
	pick,
	rateRoll,
	createEmbedMessage,
} = require("../util/formatUtil");
const { keys: giftKeys, contents: giftContents } = require("../util/GiftKeys");

exports.run = async (client, message, args) => {
	const action = (args[2] || "").toLowerCase();

	switch (action) {
		case "start":
			await pickWinner(client, message);
			break;
		default:
			await showParticipants(client, message);
	}
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["hl"];

async function pickWinner(client, message) {
	const spinner = getEmoji(client, "spin");
	const nitro = giftContents(client)[giftKeys.nitro].icon;
	const enclose = (m, icon = spinner) => `${icon} ${m} ${icon}`;
	const m = await message.channel.send(enclose("Picking a winner"));
	const participants = await getParticipants(client);

	const pool = participants.reduce((prev, next) => {
		return prev.concat(
			Array(+next.entries)
				.fill()
				.map(() => next.id)
		);
	}, []);

	const pickId = pick(pool);
	const winner = participants.find(({ id }) => pickId === id);

	const filtered = participants.filter(({ id }) => id !== pickId);
	const dummyPick = shuffle(filtered).slice(
		0,
		Math.floor(filtered.length * 0.3)
	);
	for (const user of dummyPick) {
		await delay(500);
		await m.edit(
			`${enclose("Picking a winner")}\n\n${mentionAuthor({
				author: user,
			})}`
		);
	}

	const raffleService = new RaffleService(client.database);
	await raffleService.exclude(winner.id);
	await assignNitro(message, client, winner);

	await m.edit(
		enclose(`${mentionAuthor({ author: winner })} won the raffle!`, nitro)
	);
}

async function assignNitro(message, client, target) {
	const nitroService = new NitroService(client.database);

	const pool = await nitroService.getRaffle();
	console.log(target);

	const entry = Object.keys(pool).find((k) => !pool[k].owner);
	console.log("entry", entry);

	if (entry) {
		await nitroService.assignRaffle(entry, target.id);
	}
}

async function getParticipants(client) {
	const raffleService = new RaffleService(client.database);
	const userService = new UserService(client.database);
	const inventoryService = new InventoryService(client.database);

	const users = await userService.getAll();
	const inventories = await inventoryService.getAll();
	const excluded = await raffleService.getExcluded();

	const ticketId = giftContents(client)[giftKeys.potchicket].id;

	return Object.keys(inventories)
		.filter((k) => Object.keys(users).includes(k) && !excluded.includes(k))
		.map((k) => {
			const entries = inventories[k][ticketId]
				? inventories[k][ticketId].quantity || 0
				: 0;
			return {
				...users[k],
				entries,
			};
		})
		.filter((a) => !!a);
}

async function delay(ms) {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve("ok");
		}, ms);
	});
}

async function showParticipants(client, message) {
	const participants = await getParticipants(client);

	if (participants && participants.length) {
		const response = participants
			.sort((a, b) => {
				const { entries: entriesA } = a;
				const { entries: entriesB } = b;
				return entriesB - entriesA;
			})
			.sort((a, b) => {
				const { username: usernameA } = a;
				const { username: usernameB } = b;
				return usernameA > usernameB ? 1 : usernameA < usernameB ? -1 : 0;
			})
			.map((p) => `${mentionAuthor({ author: p })} - ${p.entries}`)
			.join("\n");

		const spiel = createEmbedMessage()
			.setTitle("List of Participants and number of entries:")
			.setDescription(response)
			.setFooter(`Number of Participants: ${participants.length}`);
		await message.channel.send(spiel);
	}
}
