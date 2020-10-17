exports.run = (client, message, args) => {
	let reply = "BAWAL UTANG! :rage: :rage: :rage:";
	const target = args.filter(
		(f) => process.env.BOT_PREFIX.toLowerCase().trim() !== f.toLowerCase()
	)[1];
	if (target && target.toLowerCase() === "nena") {
		reply =
			"PAUTANG NENA MO RIN! :face_with_symbols_over_mouth: :face_with_symbols_over_mouth: :face_with_symbols_over_mouth: ";
	}

	message.channel.send(reply);
};

exports.help = `Just an example command. Usage: ${process.env.BOT_PREFIX}example`;
exports.aliases = ["utang"];
