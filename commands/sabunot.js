const SABUNOT_IMG = `https://cdn.discordapp.com/attachments/765047137473265714/769803669875982366/Screen-Shot-2018-06-06-at-2.png`;

const Canvas = require("canvas");
const Discord = require("discord.js");

const WIDTH = 640;
const HEIGHT = 420;

const AVATAR_W = 70;
const AVATAR_H = 70;

const BATOKEE_W = 60;
const BATOKEE_H = 60;

const batoker = (w, h) => ({
	x: w * 0.1,
	y: h * 0.2,
});
const batokee = (w, h) => ({
	x: w * 0.27,
	y: h * 0.57,
});

exports.run = async (client, message, args) => {
	const { author } = message;
	const mention = message.mentions.members.first() || { user: author };

	const canvas = Canvas.createCanvas(WIDTH, HEIGHT);
	const ctx = canvas.getContext("2d");
	const background = await Canvas.loadImage(SABUNOT_IMG);
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
		"sabunot.png"
	);

	message.channel.send(attachment);
};

exports.help = "Send Sabunot Image";
exports.aliases = ["sb"];
