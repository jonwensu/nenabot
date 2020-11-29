const { getEmoji } = require("./formatUtil");
const maskNitro = process.env.MASK_NITRO === "true";

const keys = {
	potchicket: "POTCHICKET",
	potchi: "POTCHI",
	nitro: "NITRO",
};

module.exports = {
	keys,
	contents: (client) => ({
		[keys.potchi]: {
			id: 1,
			name: "Potchi",
			icon: getEmoji(client, "potchi"),
		},
		[keys.potchicket]: {
			id: 2,
			name: "Potchicket",
			icon: "🎟️",
		},
		[keys.nitro]: {
			id: 8,
			name: maskNitro ? "Potato" : "Discord Nitro Classic Voucher",
			icon: maskNitro ? "🥔" : getEmoji(client, "pnitro"),
		},
	}),
};
