const cron = require("node-cron");
const axios = require("axios");

const InventoryService = require("../services/InventoryService");
const UserService = require("../services/UserService");
const POTCHI_ID = 1;
const MYSTERIOUS_ITEM_ID = 2;

const crates = [
	{ name: "A", emoji: "🇦" },
	{ name: "B", emoji: "🇧" },
	{ name: "C", emoji: "🇨" },
	{ name: "D", emoji: "🇩" },
	{ name: "E", emoji: "🇪" },
];

const {
	POTCHI_DROP_WEBHOOK,
	POTCHI_DROP_CRON_SCHEDULE,
	POTCHI_DROP_REACT_DURATION,
	POTCHI_DROP_RATE,
	POTCHI_DROP_MASSIVE_RATE,
	POTCHI_DROP_MULTICRATE_RATE,
	POTCHI_DROP_MULTIPLIER,
	POTCHI_DROP_PICKER_SUMMARY_DURATION,
	POTCHI_DROP_CHANNEL_POOL,
} = process.env;

const {
	pick,
	createEmbedMessage,
	getEmoji,
	rateRoll,
	mentionAuthor,
	italic,
	doRollRange,
	bold,
	underline,
	shuffle,
} = require("../util/formatUtil");

const POTCHI_IMG =
	"https://cdn.discordapp.com/attachments/765047137473265714/772071733200551946/74ab611596f6c285e8b5f89e74203c9d.png";
const CHANNEL_POOL = POTCHI_DROP_CHANNEL_POOL.split(",");

function createMessage(title, color = "#FF5AB5") {
	return createEmbedMessage(color).setAuthor(title, POTCHI_IMG);
}

module.exports = {
	potchiDrop,
	execute: async (client) => {
		cron.schedule(POTCHI_DROP_CRON_SCHEDULE, async () => {
			if (rateRoll(POTCHI_DROP_RATE)) {
				await potchiDrop(client);
			}
		});
	},
};

async function potchiDrop(client) {
	const channelId = pick(CHANNEL_POOL);
	const channel = await client.channels.fetch(channelId);

	if (channel) {
		await executeDrop(client, channel);
	}
}

function givePotchi(multiplier = POTCHI_DROP_MULTIPLIER, min = 1, max = 5) {
	return Math.ceil((doRollRange(min, max) + 1) * parseFloat(multiplier));
}

async function updateInventory(client, pickers) {
	const inventoryService = new InventoryService(client.database);
	const userService = new UserService(client.database);

	const invs = (await inventoryService.getAll()) || {};

	const userUpdate = pickers.reduce((prev, next) => {
		const { user } = next;
		return {
			...prev,
			[user.id]: user,
		};
	}, {});
	const update = pickers.reduce((prev, next) => {
		const { user, quantity } = next;
		const out = { ...prev };
		if (!Object.keys(invs).includes(user.id)) {
			out[user.id] = {
				[POTCHI_ID]: {
					itemId: POTCHI_ID,
					quantity,
				},
				[MYSTERIOUS_ITEM_ID]: {
					itemId: MYSTERIOUS_ITEM_ID,
					quantity: 1,
				},
			};
		} else {
			const entry = invs[user.id];
			const potchiEntry = entry[POTCHI_ID];
			out[user.id] = {
				...entry,
				[POTCHI_ID]: {
					...potchiEntry,
					quantity: +potchiEntry.quantity + +quantity,
				},
			};
		}

		return out;
	}, {});

	console.log("userUpdate", userUpdate);
	console.log("updates", update);
	await inventoryService.update(update);
	await userService.updateUsers(userUpdate);
}

function collect(dropType, rates, pickers) {
	return async (r, user) => {
		const alreadyAdded = pickers.some(({ user: { id } }) => id === user.id);
		if (!alreadyAdded) {
			console.log("User added:", user.id);
			const multiplier = dropType.multiplier || rates.NORMAL.multiplier;
			const min = dropType.min || rates.NORMAL.min;
			const max = dropType.max || rates.NORMAL.max;

			pickers.push({
				user,
				quantity: givePotchi(multiplier, min, max),
			});
		}
	};
}

async function executeDrop(client, channel) {
	// emojis
	const potchi = getEmoji(client, "potchi");
	const potchiPing = getEmoji(client, "a_potchiPing") || "🚨";
	const sumabog = getEmoji(client, "a_sumabog") || "😢";
	const crateEmojis = crates.map((c) => c.emoji);

	const NORMAL_RATE =
		100 - (+POTCHI_DROP_MASSIVE_RATE + +POTCHI_DROP_MULTICRATE_RATE);

	const rates = {
		NORMAL: {
			name: "POTCHI_DROP_NORMAL",
			value: NORMAL_RATE,
			title: "RANDOM POTCHI DROP",
			min: 2,
			max: 5,
			multiplier: POTCHI_DROP_MULTIPLIER,
			reactions: [potchi],
		},
		MASSIVE: {
			name: "POTCHI_DROP_MASSIVE",
			value: POTCHI_DROP_MASSIVE_RATE,
			title: "MASSIVE POTCHI DROP",
			description: `${potchiPing} ${bold(
				`MAMIII ALERT MARAMI TO!!!`
			)} ${potchiPing}\n\nReact ${potchi} to this message to pick them up`,
			min: 5,
			max: 10,
			multiplier: POTCHI_DROP_MULTIPLIER * 2,
			reactions: [potchi],
		},
		MULTICRATE: {
			name: "POTCHI_DROP_MULTICRATE",
			value: POTCHI_DROP_MULTICRATE_RATE,
			title: "MULTICRATE DROP",
			description: `${bold(underline(`CHOOSE A CRATE`))}\n\n${crateEmojis
				.map((c) => c)
				.join("  🔸  ")}\n\n${italic(
				`(The first one you pick will be acknowledged)`
			)}`,
			reactions: crateEmojis,
			collect: (dropType, rates, pickers, { crateMap }) => async (r, user) => {
				const alreadyAdded = pickers.some(({ user: { id } }) => id === user.id);

				if (!alreadyAdded) {
					console.log("User added:", user.id);

					const match = crates.find(({ emoji }) => emoji === r.emoji.name);

					pickers.push({
						user,
						quantity: crateMap[match.name],
						crate: match.name,
					});

					console.log(pickers);
				}
			},
			filter: (r, user) => !user.bot && crateEmojis.includes(r.emoji.name),
		},
	};

	const pool = Object.keys(rates).reduce(
		(prev, next) =>
			prev.concat(
				Array(+rates[next].value)
					.fill()
					.map(() => next)
			),
		[]
	);

	const dropType = rates[pick(pool)];

	const embed = createMessage(dropType.title)
		.setDescription(
			`${
				dropType.description ||
				`React ${potchi} to this message to pick them up`
			}`
		)
		.setFooter(
			`Ends in ${Math.floor(POTCHI_DROP_REACT_DURATION / 1000)} seconds`
		);
	const message = await channel.send(embed);

	const crateContents = shuffle([
		givePotchi(),
		givePotchi(),
		givePotchi(POTCHI_DROP_MULTIPLIER * 2, 5, 10),
		1,
		0,
	]);

	const crateMap = crates.reduce(
		(prev, next, i) => ({
			...prev,
			[next.name]: crateContents[i],
		}),
		{}
	);

	const pickers = [];
	let spiel = "";

	const filter =
		dropType.filter || ((r, user) => !user.bot && r.emoji.name === potchi.name);
	const collector = message.createReactionCollector(filter, {
		time: POTCHI_DROP_REACT_DURATION,
	});
	message.delete({ timeout: POTCHI_DROP_REACT_DURATION - 500 });

	collector.on(
		"collect",
		dropType.collect
			? dropType.collect(dropType, rates, pickers, { crateMap })
			: collect(dropType, rates, pickers)
	);

	collector.on("end", async () => {
		let embed = createMessage(`${dropType.title} ENDED`);
		const tip = italic(
			`Type ${bold(`${process.env.BOT_PREFIX} inv`)} to check you inventory`
		);
		const joined = pickers
			.map(
				({ user: author, quantity }) =>
					`${mentionAuthor({ author })} - ${quantity}pcs`
			)
			.join("\n");

		if (pickers.length > 0) {
			await updateInventory(client, pickers);

			if (dropType.name === rates.MULTICRATE.name) {
				spiel = crates
					.map((c) => {
						const p = pickers
							.filter((pp) => pp.crate === c.name)
							.map((pp) => mentionAuthor({ author: pp.user }));
						const s = p.length > 0 ? p.join("\n") : "None";
						return `${bold(
							`CRATE ${c.emoji} - ${crateMap[c.name]}pc${
								crateMap[c.name] === 1 ? "" : "s"
							} each`
						)}\n${s}`;
					})
					.join("\n\n");
				embed = embed
					.setTitle("The following members picked up some potchis:")
					.setDescription(`${spiel}\n\n${tip}`);
			} else {
				embed = embed
					.setTitle("The following members picked up some potchis:")
					.setDescription(`${joined}\n\n${tip}`);
				spiel = pickers.length ? joined : "None";
			}
		} else {
			embed = createMessage(`${dropType.title} ENDED`).setDescription(
				`Kinain ng lupa ang mga potchi kasi walang pumulot ${sumabog}`
			);
		}
		const summary = await message.channel.send(embed);
		summary.delete({ timeout: POTCHI_DROP_PICKER_SUMMARY_DURATION });

		const total = pickers
			.map(({ quantity }) => quantity)
			.reduce((prev, next) => +prev + +next, 0);

		await axios.post(POTCHI_DROP_WEBHOOK, {
			embeds: [
				{
					description: `Channel: ${channel}\n\nPickers:\n${spiel}`,
					color: 15402245,
					author: {
						name: `${dropType.title} ENDED`,
						icon_url: POTCHI_IMG,
					},
					footer: {
						text: `Total: ${total}`,
					},
				},
			],
		});
	});

	Promise.all(dropType.reactions.map(async (r) => await message.react(r)));

	axios.post(POTCHI_DROP_WEBHOOK, {
		embeds: [
			{
				description: `Channel: ${channel}`,
				color: 3067672,
				author: {
					name: `${dropType.title} STARTED`,
					icon_url: POTCHI_IMG,
				},
			},
		],
	});
}
