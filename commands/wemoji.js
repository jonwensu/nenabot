const Discord = require("discord.js");

exports.run = async (client, message, args) => {

  const reminders = [
    [
      '**1.** The game will start at 9:00pm PH Time',
    '**2.** The Official List of Participants will be Posted at 8:00pm PH Time',
    ],
    [
      '**3.** Only those who reacted to the message linked below will be recognized as participants:\n    https://discordapp.com/channels/749742356466761922/749745911709827123/765044041816997908',
    ],
    [
      '**4.** Participants will be given the **@Emoji Gamer** role which allows them to send messages to this channel once the game starts\n',
      '**5.** Participants must react :koala: to the prompt once the game starts in order for the bot to acknowledge their answers',
    ],
    [
      "**6.** Using **Discord's Desktop version** is highly recommended",
      '\n*For questions and clarifications, please reach out to our **Bantays***',

    ],
  ]

	let exampleEmbed = new Discord.MessageEmbed()
		.setColor("#0099ff")
		.setTitle("WELCOME MGA KAPOTCHI SA EMOJI GAMING PIT!!!")
		.setDescription("THIS IS WHERE THE **EMOJI GAME** WILL TAKE PLACE. BELOW ARE SOME IMPORTANT REMINDERS:")
		.setThumbnail(
			"https://cdn.discordapp.com/attachments/762287286280781834/766937704855371807/potchi.png"
    )
    ;

  await message.channel.send(exampleEmbed);

  reminders.forEach(async r => {
    const spiel = new Discord.MessageEmbed()
		.setColor("#0099ff")
    .setDescription(r.join("\n"), "__________________________________________________________________", false)
    ;

    await message.channel.send(spiel);
  })
  
	// exampleEmbed = new Discord.MessageEmbed()
	// 	.setColor("#0099ff")
  //   .setDescription(reminders.join("\n"), "__________________________________________________________________", false)
  //   ;

  // await message.channel.send(exampleEmbed);
  
	// exampleEmbed = new Discord.MessageEmbed()
	// 	.setColor("#0099ff")
  //   .setDescription(reminders2.join("\n"), "__________________________________________________________________", false)
  //   .setFooter("For questions and clarifications please reach out to our Bantays")
  //   ;

	// await message.channel.send(exampleEmbed);
};

exports.help =
	"Just an example command. Usage: `${process.env.BOT_PREFIX}example`";
exports.aliases = ["pn"];
