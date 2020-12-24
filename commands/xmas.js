const {
	createEmbedMessage,
	italic,
	bold,
	pick,
} = require("../util/formatUtil");

const thumbnail =
	"https://cdn.discordapp.com/attachments/765047137473265714/791554092144263209/xmastree.gif";

exports.run = (client, message, args) => {
	const day = args[2] || 12;
	const { title, lyrics } = nthDayOfXmas(day);
	const response = createEmbedMessage(pick(["#E6EC0E", "#f01519", "#39cc19"]))
		.setTitle(title)
		.setDescription(italic(lyrics))
		.setThumbnail(thumbnail);
	message.channel.send(response);
};

exports.help =
	"Display SMB's version of 12 days of Christmas based on the day entered";
exports.aliases = ["xm"];

const days = {
	12: { number: "Twelve", dish: "Platong Laings" },
	11: { number: "Eleven", dish: "Sizzling Gambas" },
	10: { number: "Ten", dish: "Crispy Crablets" },
	9: { number: "Nine", dish: "Papaitans" },
	8: { number: "Eight", dish: "Lechong Kawalis" },
	7: { number: "Seven", dish: "Tuna Bellies" },
	6: { number: "Six", dish: "Spicy Squids" },
	5: { number: "Five", dish: "Tuknenengs" },
	4: { number: "Four", dish: "Kilawins" },
	3: { number: "Three", dish: "Sisigs" },
	2: { number: "Two", dish: "Isaw sticks" },
	1: { number: "Isang", dish: "Malamig na San Miguel Beer!" },
};

function nthDayOfXmas(day) {
	const title = `On the ${day}${nth(
		day
	)} of Christmas Aling Nena gave to me...`;
	const lyrics = Object.keys(days)
		.filter((d) => +d <= day)
		.map((d) => +d)
		.sort((a, b) => a - b)
		.reverse()
		.map((d, i, arr) => {
			const { number, dish } = days[+d];
			const spiel = `${
				+day !== 1 && i === arr.length - 1 ? "at " : ""
			}${number} ${bold(dish)}`;
			return spiel;
		})
		.join("\n");
	return {
		title,
		lyrics,
	};
}

function nth(n) {
	return ["st", "nd", "rd"][((((n + 90) % 100) - 10) % 10) - 1] || "th";
}
