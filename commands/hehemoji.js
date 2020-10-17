const Discord = require("discord.js");
const emojis = require("../data/emoji/movie");
const Game = require("../helper/game");


function doRoll(max) {
	return Math.floor(Math.random() * max);
}
let timer = null;

const {
	QUESTION_DURATION,
	PARTICIPANT_WAIT_DURATION,
	NEX_QUESTION_DELAY,
	MAX_ROUNDS,
} = process.env;

const KOALA_ICON = "🐨";

function createMessage() {
	return new Discord.MessageEmbed().setColor("#0099ff").setTitle("Emoji Game");
}

async function showScores(game, message) {
	const { participants } = game;
	const sorted = participants.sort((a, b) => b.score - a.score);

	const [winner] = sorted;

	await message.channel.send(
		createMessage().setDescription(
			`🏆 <@${winner.id}> won the game. Congratulations! 🏆`
		)
	);

	const spiel = createMessage()
		.setDescription("Scoreboard:")
		.addFields(
			sorted.map(({ tag, score }, i) => ({
				name: `#${i + 1} ${tag}${i === 0 ? ' 🏆' : '' }`,
				value: `${score} points`,
			}))
		);

	await message.channel.send(spiel);
}

async function endGame() {}

async function showNextQuestion(game, message, spiel) {
	if (!game.isLastRound()) {
		await message.channel.send(
			spiel.setFooter(`Showing next question in 5s...`)
		);
		game.nextRound();
		setTimeout(() => showQuestion(game, message), NEX_QUESTION_DELAY);
	} else {
		console.log("GAME OVER");
		await message.channel.send(spiel);
		await showScores(game, message);
	}
}

async function showQuestion(game, message) {
	const { round, totalRounds } = game;
	const { question, answer, alias } = game.currentEmoji();
	const spiel = createMessage()
		.addField(`Guess the movie:`, question)
		.setFooter(`Round ${round + 1} of ${totalRounds}`);
	await message.channel.send(spiel);

	const filter = (m) => game.participants.some(({ id }) => id === m.author.id);

	const collector = message.channel.createMessageCollector(filter, {
		time: QUESTION_DURATION,
	});

	collector.on("collect", async (m) => {
		const {
			content,
			author: { id: authorId },
		} = m;
		console.log(`Collected ${content}`);

		const isDone = game.currentEmoji().done;

		if (!isDone) {
			const c = content.trim().toLowerCase();
			const match = c === answer.toLowerCase();
			console.log("alias", alias);
			const aliasMatch = alias && alias.map((a) => a.toLowerCase()).includes(c);

			if (match || aliasMatch) {
				game.markDone();
				game.addScore(authorId);
				await m.react("✅");
				collector.stop("answered");

				const spiel = createMessage().setDescription(
					`🏆 <@${authorId}> got the correct answer: **${answer.toUpperCase()}** 🏆`
				);

				await showNextQuestion(game, message, spiel);
			}
		}
	});

	collector.on("end", async (m, reason) => {
		console.log("endreason", reason);
		if (reason !== "answered") {
			const spiel = createMessage().addField(
				`**${game.currentEmoji().answer.toUpperCase()}**`,
				"was the correct answer"
			);

			await showNextQuestion(game, message, spiel);
		}
	});
}

async function gatherParticipants(game, message) {
	const spiel = createMessage().addField(
		`Starting Emoji Game in ${+process.env.PARTICIPANT_WAIT_DURATION / 1000} seconds.`,
		`Please react ${KOALA_ICON} to this message to participate`
	);
	const collectorMessage = await message.channel.send(spiel);
	await collectorMessage.react(KOALA_ICON);

	const collector = collectorMessage.createReactionCollector(
		(reaction) => reaction.emoji.name === KOALA_ICON,
		{
			time: PARTICIPANT_WAIT_DURATION,
		}
	);

	collector.on("collect", (reaction, user) => {
		const { participants } = game;
		if (!participants.includes(user.id)) {
			game.addParticipant(user);
			console.log("Participant Added:", user.id);
			console.log(JSON.stringify(game.participants));
		}
	});

	collector.on("end", (collected) => {
		if (game.participants.length > 0) {
			showQuestion(game, message);
		} else {
			const spiel = createMessage().setDescription(
				"No participants found :cry:"
			);
			message.channel.send(spiel);
		}
	});
}

function shuffle(b) {
	const a = b.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

exports.run = (client, message, args) => {
	const rounds = args[2] || MAX_ROUNDS;

	const game = new Game(shuffle(emojis), rounds);
	gatherParticipants(game, message);
};

exports.help = "Start emoji game";
exports.aliases = ["emo"];
