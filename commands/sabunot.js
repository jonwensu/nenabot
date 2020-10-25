const SABUNOT_IMG = `https://cdn.discordapp.com/attachments/765047137473265714/769803669875982366/Screen-Shot-2018-06-06-at-2.png`;

const Canvas = require("canvas");
const Discord = require("discord.js");

const WIDTH = 640;
const HEIGHT = 420;

const AVATAR_W = 70;
const AVATAR_H = 70;

const SABUNOTEE_W = 60;
const SABUNOTEE_H = 60;

const sabunoter = (w, h) => ({
	x: w * 0.1,
	y: h * 0.2,
});
const sabunotee = (w, h) => ({
	x: w * 0.03,
	y: h * 0.75,
});

exports.run = async (client, message, args) => {
	const { author } = message;
	const mention = message.mentions.members.first() || { user: author };

	const canvas = Canvas.createCanvas(WIDTH, HEIGHT);
	const ctx = canvas.getContext("2d");
	const background = await Canvas.loadImage(SABUNOT_IMG);
	const sabunoterAvatar = await Canvas.loadImage(
		author.displayAvatarURL({ format: "png" })
	);
	const sabunoteeAvatar = await Canvas.loadImage(
		mention.user.displayAvatarURL({ format: "png" })
	);

	const sabunoterDim = sabunoter(WIDTH, HEIGHT);
	const sabunoteeDim = sabunotee(WIDTH, HEIGHT);

	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(
		sabunoterAvatar,
		sabunoterDim.x,
		sabunoterDim.y,
		AVATAR_W,
		AVATAR_H
	);

	ctx.save();
	ctx.rotate((-30 * Math.PI) / 180);
	ctx.drawImage(
		sabunoteeAvatar,
		sabunoteeDim.x,
		sabunoteeDim.y,
		SABUNOTEE_W,
		SABUNOTEE_H
	);

	ctx.restore();

	const attachment = new Discord.MessageAttachment(
		canvas.toBuffer(),
		"sabunot.png"
	);

	message.channel.send(attachment);
};

exports.help = "Send Sabunot Image";
exports.aliases = ["sb"];
