const Discord = require("discord.js");

function doRoll(max) {
	return Math.floor(Math.random() * max);
}

function shuffle(b) {
	const a = b.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

const items = [
	{
		name: "Shabu :smiling_imp: ",
		value: "shabu",
		price: 420,
		success: {
			rate: 30,
			spiel: (m) => {
				const {
					author: { id: authorId },
				} = m;
				return `Bumili si <@${authorId}> ng **SHABU** dali dali nyang itinago ito sa kanyang bulsa`;
			},
		},
		fail: ({ author: { id: authorId } }) =>
			`Nahuli ng mga pulis si <@${authorId}> hawak hawak ang **SHABU**. Himas rehas sya ngayon.`,
	},
	{
		name: "Pancit Canton ",
		value: "pancit canton",
		price: 666,
		success: {
			rate: 90,
			spiel: (m) => {
				const {
					author: { id: authorId },
				} = m;

				let extra = "";

				const ing = ["NOODLES", "SEASONING"];

				const inuna = shuffle(ing)
					.map((i) => `**${i}**`)
					.join(" bago ");

				if (doRoll(100) < 40) {
					const extras = ["AMPALAYA", "PEANUT BUTTER", "MANG TOMAS"];
					extra = ` at dinagdagan ng **${extras[doRoll(extras.length)]}**`;
				}

				return `Bumili si <@${authorId}> ng **PANCIT CANTON** inuna ang ${inuna}${extra}.`;
			},
		},
		fail: ({ author: { id: authorId } }) =>
			`Hindi nakabili si <@${authorId}> ng **PANCIT CANTON** kasi out of stock.`,
	},
	{
		name: "Piattos :large_orange_diamond: ",
		value: "piattos",
		price: 10,
		success: {
			rate: 90,
			spiel: (m) => {
				const {
					author: { id: authorId },
				} = m;

				const flavors = [
					"CHEESE",
					"SOUR CREAM",
					"ROAST BEEF",
					"NACHO PIZZA",
					"ROADHOUSE BARBECUE",
				];

				const flavor = flavors[doRoll(flavors.length)];

				const peros = [
					"**HANGIN** ang laman",
					"**BOY BAWANG** ang laman",
					"nabubuksan lang pag mahilig ka sa **PAKSIW NA ISDA**",
					"expired na",
					"kinuha ng **KOALA**",
				];

				let pero = peros[doRoll(peros.length)];

				return `Bumili si <@${authorId}> ng **PIATTOS** na **${flavor}** pero ${pero}.`;
			},
		},
		fail: ({ author: { id: authorId } }) =>
			`Hindi nakabili si <@${authorId}> ng **PIATTOS** kasi out of stock.`,
	},
	{
		name: "Jowa :broken_heart:",
		value: "jowa",
		price: 69,
		success: {
			rate: 60,
			spiel: (m) => {
				const {
					author: { id: authorId },
				} = m;
				const sanas = [
					"all",
					"naman magtagal kayo",
					"mag break kayo",
					"ako nalang inorder mo",
				];

				const sana = sanas[doRoll(sanas.length)];

				return `Umorder si <@${authorId}> ng **JOWA** sana ${sana}.`;
			},
		},
		fail: ({ author: { id: authorId } }) =>
			`DI MO AFFORD MAGKAJOWA MAMIII <@${authorId}>`,
	},
	{
		name: "Peewee :pizza:",
		value: "peewee",
		price: 5,
		success: {
			rate: 0,
			spiel: (m) => {
				const {
					author: { id: authorId },
				} = m;
				return `Bumili si <@${authorId}> ng **SHABU** dali dali nyang itinago ito sa kanyang bulsa`;
			},
		},
		fail: ({ author: { id: authorId } }) =>
			`Hindi nakabili si <@${authorId}> ng **PEEWEE** kasi out of stock.`,
	},
	{
		name: "Fries :fries:",
		value: "fries",
		price: 50,
		success: {
			rate: 0,
			spiel: (m) => {
				const {
					author: { id: authorId },
				} = m;
				return `Bumili si <@${authorId}> ng **SHABU** dali dali nyang itinago ito sa kanyang bulsa`;
			},
		},
		fail: ({ author: { id: authorId } }) =>
			`Hindi nakabili si <@${authorId}> ng **FRIES** kasi out of stock.`,
	},
];

exports.run = (client, message, args) => {
	const [arg1, arg2, ...restArgs] = args;
	const order =
		restArgs.length > 0
			? restArgs.map((r) => r.trim().toLowerCase()).join(" ")
			: null;

	console.log("order", order);

	let spiel = new Discord.MessageEmbed()
		.setColor("#0099ff")
		.setTitle("Paninda")
		.setAuthor("Aling Nena")
		.setDescription("Mga Paninda sa Tindahan ni Aling Nena")
		.setThumbnail(
			"https://cdn.discordapp.com/icons/749742356466761922/73a5e5150238a0af17992739d9346641.webp"
		)
		.addFields(
			...items.map(({ name, value, price }) => ({
				name,
				value: `₱${price.toFixed(2)}`,
				inline: true,
			}))
		)
		.setFooter(`Type ${process.env.BOT_PREFIX}pabili <item> to buy`);

	if (order) {
		const match = items.find(
			({ value }) =>
				value.toLocaleLowerCase() === order.trim().toLocaleLowerCase()
		);

		if (match) {
			const roll = doRoll(100);

			const {
				success: { rate, spiel: ss },
				fail,
			} = match;

			const success = roll < rate;

			console.log("rate", rate, "roll", roll, "success", success);

			spiel = success ? ss(message) : fail(message);
		}
	}

	message.channel.send(spiel);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["pn"];
