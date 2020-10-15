const Discord = require("discord.js");

const { bold, mentionAuthor } = require("../util/formatUtil");

function doRoll(max) {
	return Math.floor(Math.random() * max);
}

function pick(pool) {
	return pool[doRoll(pool.length)];
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
				return `Bumili si ${mentionAuthor(m)} ng ${bold(
					`SHABU`
				)} dali dali nyang itinago ito sa kanyang bulsa`;
			},
		},
		fail: (message) =>
			`Nahuli ng mga pulis si ${mentionAuthor(message)} hawak hawak ang ${bold(
				`SHABU`
			)}. Himas rehas sya ngayon.`,
	},
	{
		name: "Pancit Canton :ramen: ",
		value: "pancit canton",
		price: 666,
		success: {
			rate: 90,
			spiel: (m) => {
				let extra = "";

				const ing = ["NOODLES", "SEASONING"];

				const inuna = shuffle(ing)
					.map((i) => bold(i))
					.join(" bago ");

				if (doRoll(100) < 50) {
					const extras = ["AMPALAYA", "PEANUT BUTTER", "MANG TOMAS", "PASAS"];
					extra = ` at dinagdagan ng ${bold(pick(extras))}`;
				}

				return `Bumili si ${mentionAuthor(m)} ng ${bold(
					`PANCIT CANTON`
				)} inuna ang ${inuna}${extra}.`;
			},
		},
		fail: (message) =>
			`Hindi nakabili si ${mentionAuthor(message)} ${bold(
				`PANCIT CANTON`
			)} kasi out of stock.`,
	},
	{
		name: "Piattos :large_orange_diamond: ",
		value: "piattos",
		price: 10,
		success: {
			rate: 90,
			spiel: (m) => {
				const flavors = [
					"CHEESE",
					"SOUR CREAM",
					"ROAST BEEF",
					"NACHO PIZZA",
					"ROADHOUSE BARBECUE",
				];

				const flavor = pick(flavors);

				const peros = [
					`${bold(`HANGIN`)} ang laman`,
					`${bold(`BOY BAWANG`)} ang laman`,
					`nabubuksan lang pag mahilig ka sa ${bold(`PAKSIW NA ISDA`)}`,
					`expired na`,
					`kinuha ng ${bold(`KOALA`)}`,
				];

				let pero = pick(peros);

				return `Bumili si ${mentionAuthor(m)} ng ${bold(`PIATTOS`)} na ${bold(
					flavor
				)} pero ${pero}.`;
			},
		},
		fail: (message) =>
			`Hindi nakabili si ${mentionAuthor(message)} ng ${bold(
				`PIATTOS`
			)} kasi out of stock.`,
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
					"Sana all",
					"Sana naman magtagal kayo",
					"Sana mag break kayo. Salamat nalang sa lahat",
					"Sana ako nalang inorder mo.",
					"Last mo na yan ha",
					"Ako yung idineliver",
				];

				const sana = pick(sanas);

				return `Umorder si ${mentionAuthor(m)} ng ${bold(`JOWA`)}. ${sana}.`;
			},
		},
		fail: (message) => {
			const spiels = [
				`DI MO AFFORD MAGKAJOWA MAMIII ${mentionAuthor(message)}`,
				`EW MAMIII ${mentionAuthor(message)} WALANG JOWA`,
				`IPON KA MUNA MAMIII ${mentionAuthor(
					message
				)} PARA MAY PAMBILI NG JOWA`,
			];

			return pick(spiels);
		},
	},
	{
		name: "Ice Cream :ice_cream: ",
		value: "ice cream",
		price: 20,
		success: {
			rate: 70,
			spiel: (m, client) => {
				const item = bold(`ICE CREAM`);
				const cry =
					client.emojis.cache.find((emoji) => emoji.name === "maritesCry") ||
					":cry:";

				const flavors = [
					"VANILLA",
					"ROCKY ROAD",
					"COOKIES AND CREAM",
					"DOUBLE DUTCH",
					"PEANUT BUTTER",
					"AMPALAYA",
					"MANG TOMAS",
					"PASAS",
				].map((f) => bold(f));
				const adlibs = [
					`na 3 in 1 + 1. Buti pa yung ${item} may +1 ${cry}`,
					`at nanood ng ${bold(`NETFLIX`)} mag isa habang umiiyak`,
					`na ${pick(
						flavors
					)} flavor sa cone. Nadapa sya sa daan at natapon ito`,
				];

				return `Bumili si ${mentionAuthor(m)} ng ${item} ${pick(adlibs)}.`;
			},
		},
		fail: (message) =>
			`Bumili si ${mentionAuthor(message)} ng ${bold(
				`ICE CREAM`
			)} pero nung binuksan, ${bold(`ISDA`)} ang laman.`,
	},
	{
		name: "Kape :coffee: ",
		value: "kape",
		price: 150,
		success: {
			rate: 90,
			spiel: (m) => {
				const size = ["TALL", "GRANDE", "VENTI"].map(bold);

				const base = [
					"CARAMEL MACCHIATO",
					"CAFE LATTE",
					"3 IN 1 COFFEE",
					"COLD BREW",
					"KAPE BARAKO",
				].map(bold);

				let syrup = "";
				if (doRoll(100) < 50) {
					const sauce = [
						"VANILLA SYRUP",
						"HAZELNUT SYRUP",
						"WHITE MOCHA SYRUP",
						"MANG TOMAS",
						"PEANUT BUTTER",
						"BANANA KETCHUP",
					].map(bold);

					syrup = ` with **${doRoll(2) + 2} pumps** of ${pick(sauce)}`;
				}

				return `One ${pick(size)} ${pick(base)}${syrup} for ${mentionAuthor(
					m
				)} at the counter please.`;
			},
		},
		fail: (message) => {
			const spiels = [
				`${bold(`DECAF COFFEE`)}  kasi ${bold(`DECAF`)}inili`,
				`${bold(`MATAPANG NA KAPE`)} pero di parin siya kayang ipaglaban`,
			];

			return `Bumili si ${mentionAuthor(message)} ng ${pick(spiels)}.`;
		},
	},
];

exports.run = (client, message, args) => {
	const [arg1, arg2, ...restArgs] = args;
	const order =
		restArgs.length > 0
			? restArgs.map((r) => r.trim().toLowerCase()).join(" ")
			: null;

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

			spiel = success ? ss(message, client) : fail(message);
		}
	}

	message.channel.send(spiel);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["pn"];
