const BATOK_IMG = `https://cdn.discordapp.com/attachments/749742357317943398/765113026843639828/palo.jpg`;

exports.run = (client, message, args) => {
	message.channel.send({ files: [BATOK_IMG] });
};

exports.help = "Send Batok Image";
exports.aliases = ["bt"];
