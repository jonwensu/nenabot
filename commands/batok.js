const BATOK_IMG = `https://cdn.discordapp.com/attachments/749742357317943398/765113026843639828/palo.jpg`;

const Canvas = require("canvas");
const Discord = require("discord.js");

const WIDTH = 350;
const HEIGHT = 345;

const AVATAR_W = 100;
const AVATAR_H = 100;

const BATOKEE_W = 90;
const BATOKEE_H = 90;

const batoker = (w, h) => ({
	x: w * 0.08,
	y: h * 0.15,
});
const batokee = (w, h) => ({
	x: w * 0.98 - BATOKEE_W,
	y: h * 0.35,
});

exports.run = async (client, message, args) => {
	const { author } = message;
	const mention = message.mentions.members.first() || { user: author };

	const canvas = Canvas.createCanvas(WIDTH, HEIGHT);
	const ctx = canvas.getContext("2d");
	const background = await Canvas.loadImage(BATOK_IMG);
	const batokerAvatar = await Canvas.loadImage(
		author.displayAvatarURL({ format: "png" })
	);
	const batokeeAvatar = await Canvas.loadImage(
		mention.user.displayAvatarURL({ format: "png" })
	);

	const batokerDim = batoker(WIDTH, HEIGHT);
	const batokeeDim = batokee(WIDTH, HEIGHT);

	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(batokerAvatar, batokerDim.x, batokerDim.y, AVATAR_W, AVATAR_H);
	ctx.drawImage(
		batokeeAvatar,
		batokeeDim.x,
		batokeeDim.y,
		BATOKEE_W,
		BATOKEE_H
	);

	const attachment = new Discord.MessageAttachment(
		canvas.toBuffer(),
		"batok.png"
	);

	message.channel.send(attachment);
};

exports.help = "Send Batok Image";
exports.aliases = ["bt"];
