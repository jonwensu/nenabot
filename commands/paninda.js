const Discord = require("discord.js");

exports.run = (client, message, args) => {
	const items = [
		{
			name: "Shabu :smiling_imp: ",
			value: "shabu",
			price: 420,
		},
		{
			name: "Rugby :smiling_imp: ",
			value: "rugby",
			price: 420,
		},
		{
			name: "Peewee :pizza:",
			value: "peewee",
			price: 5,
		},
		{
			name: "Piattos :large_orange_diamond: ",
			value: "piattos",
			price: 10,
		},
		{
			name: "Jowa :broken_heart:",
			value: "jowa",
			price: 69,
		},
		{
			name: "Fries :fries:",
			value: "fries",
			price: 50,
		},
	];

	const exampleEmbed = new Discord.MessageEmbed()
		.setColor("#0099ff")
		.setTitle("Paninda")
		// .setURL("https://discord.js.org/")
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

	message.channel.send(exampleEmbed);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["pn"];
