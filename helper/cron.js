const cron = require("node-cron");
const axios = require("axios");

const InventoryService = require("../services/InventoryService");
const UserService = require("../services/UserService");
const POTCHI_ID = 1;
const MYSTERIOUS_ITEM_ID = 2;

const {
	POTCHI_DROP_WEBHOOK,
	POTCHI_DROP_CRON_SCHEDULE,
	POTCHI_DROP_REACT_DURATION,
	POTCHI_DROP_RATE,
	POTCHI_DROP_MASSIVE_RATE,
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
	doRoll,
	doRollRange,
	bold,
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
		const potchi = getEmoji(client, "potchi");
		const potchiPing = getEmoji(client, "a_potchiPing") || "🚨";
		const sumabog = getEmoji(client, "a_sumabog") || "😢";
		const isMassiveDrop = rateRoll(POTCHI_DROP_MASSIVE_RATE);
		const title = isMassiveDrop
			? `MASSIVE POTCHI DROP`
			: "Random Potchi Drop!!";
		const type = isMassiveDrop ? "MASSIVE " : "";
		const addtlDesc = isMassiveDrop
			? `${potchiPing} ${bold(`MAMIII ALERT MARAMI TO!!!`)} ${potchiPing}\n\n`
			: "";

		const embed = createMessage(title)
			.setDescription(
				`${addtlDesc}React ${potchi} to this message to pick them up`
			)
			.setFooter(`Ends in ${POTCHI_DROP_REACT_DURATION / 1000} seconds`);
		const message = await channel.send(embed);
		await message.react(potchi);

		axios.post(POTCHI_DROP_WEBHOOK, {
			embeds: [
				{
					description: `Channel: ${channel}`,
					color: 3067672,
					author: {
						name: `${type}Potchi Drop Started`,
						icon_url: POTCHI_IMG,
					},
				},
			],
		});

		const pickers = [];

		const filter = (r) => r.emoji.name === potchi.name;
		const collector = message.createReactionCollector(filter, {
			time: POTCHI_DROP_REACT_DURATION,
		});
		message.delete({ timeout: POTCHI_DROP_REACT_DURATION - 500 });
		collector.on("collect", async (r, user) => {
			console.log("User added:", user.id);
			const alreadyAdded = pickers.some(({ user: { id } }) => id === user.id);
			if (!alreadyAdded) {
				const multiplier = isMassiveDrop
					? POTCHI_DROP_MULTIPLIER * 2
					: POTCHI_DROP_MULTIPLIER;
				const min = isMassiveDrop ? 5 : 2;
				const max = isMassiveDrop ? 10 : 5;

				const test = Array(100)
					.fill()
					.map(() => givePotchi(multiplier, min, max));
				console.log("test", test);

				pickers.push({
					user,
					quantity: givePotchi(multiplier, min, max),
				});
			}
		});

		collector.on("end", async (collected) => {
			const joined = pickers
				.map(
					({ user: author, quantity }) =>
						`${mentionAuthor({ author })} - ${quantity}pcs`
				)
				.join("\n");

			let embed = createMessage(`${type}Potchi Drop Event Ended`);

			if (pickers.length > 0) {
				await updateInventory(client, pickers);

				embed = embed
					.setTitle("The following members picked up some potchis:")
					.setDescription(
						`${joined}\n\n*Type **${process.env.BOT_PREFIX} inv** to check you inventory*`
					);
			} else {
				embed = createMessage(`${type}Potchi Drop Event Ended`).setDescription(
					`Kinain ng lupa ang mga potchi kasi walang pumulot ${sumabog}`
				);
			}
			const summary = await message.channel.send(embed);
			summary.delete({ timeout: POTCHI_DROP_PICKER_SUMMARY_DURATION });

			const total = pickers
				.map(({ quantity }) => quantity)
				.reduce((prev, next) => +prev + +next, 0);

			axios.post(POTCHI_DROP_WEBHOOK, {
				embeds: [
					{
						description: `Channel: ${channel}\n\nPickers:\n${
							pickers.length ? joined : "None"
						}`,
						color: 15402245,
						author: {
							name: `${type}Potchi Drop Ended`,
							icon_url: POTCHI_IMG,
						},
						footer: {
							text: `Total: ${total}`,
						},
					},
				],
			});
		});
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
