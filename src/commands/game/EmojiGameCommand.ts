import { Message, MessageEmbed, User } from 'discord.js';
import Game from '../../helper/emoji/Game';
import * as rootConfig from '../../config.json';

// const init = () => {
// 	database.ref('/emojis/movie').on('value', (snapshot) => {
// 		emojis = snapshot.val().map((e) => ({
// 			...e,
// 			category: snapshot.key.toUpperCase(),
// 		}));
// 	});
// };

// init();

const {
	commands: { emoji: config },
} = rootConfig;

const KOALA_ICON = '🐨';

function createMessage() {
	return new MessageEmbed().setColor('#0099ff').setTitle('Emoji Game');
}

import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType, EmojiGameArgType } from '../../typings';
import { bold, mentionUser } from '../../util/MessageUtil';
import { shuffle } from '../../util/RngUtil';
import EmojiGameService from '../../services/EmojiGameService';

export default class EmojiGameCommand extends Command {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'hehemoji',
			memberName: 'hehemoji',
			aliases: ['emo'],
			group: CommandGroup.GAME.name,
			description: 'Play the Hehemoji game',
			args: [
				{
					key: 'rounds',
					prompt: 'How many rounds do you want to play?',
					type: 'integer',
					default: config.maxRounds,
				},
			],
		});
	}

	async showScores(game: Game, message: CommandoMessage): Promise<Message> {
		const { participants } = game;
		const sorted = participants.sort((a, b) => b.score - a.score);

		const [winner] = sorted;
		await message.channel.send(
			createMessage().setDescription(
				`🏆 ${mentionUser(winner.id)} won the game. Congratulations! 🏆`
			)
		);

		const spiel = createMessage()
			.setDescription('Scoreboard:')
			.addFields(
				sorted.map(({ username, score }, i) => ({
					name: `#${i + 1} ${username}${i === 0 ? ' 🏆' : ''}`,
					value: `${score} points`,
				}))
			);

		return await message.channel.send(spiel);
	}

	async gatherParticipants(
		game: Game,
		message: CommandoMessage
	): Promise<Message> {
		const spiel = createMessage().addField(
			`Starting Emoji Game in ${
				config.participantWaitDuration / 1000
			} seconds.`,
			`Please react ${KOALA_ICON} to this message to participate`
		);
		const collectorMessage = await message.channel.send(spiel);
		await collectorMessage.react(KOALA_ICON);

		const collector = collectorMessage.createReactionCollector(
			(reaction) => reaction.emoji.name === KOALA_ICON,
			{
				time: config.participantWaitDuration,
			}
		);

		collector.on('collect', (reaction, user: User) => {
			const { participants } = game;
			if (!participants.map(({ id }) => id).includes(user.id)) {
				game.addParticipant(user);
				console.log('Participant Added:', user.id);
				console.log(JSON.stringify(game.participants));
			}
		});

		collector.on('end', () => {
			if (game.participants.length > 0) {
				this.showQuestion(game, message);
			} else {
				const spiel = createMessage().setDescription(
					'No participants found :cry:'
				);
				message.channel.send(spiel);
			}
		});

		return collectorMessage;
	}

	async showNextQuestion(
		game: Game,
		message: CommandoMessage,
		spiel: MessageEmbed
	): Promise<Message | void> {
		if (!game.isLastRound()) {
			await message.channel.send(
				spiel.setFooter(`Showing next question in 5s...`)
			);
			game.nextRound();
			setTimeout(
				() => this.showQuestion(game, message),
				config.nextQuestionDelay
			);
		} else {
			console.log('GAME OVER');
			await message.channel.send(spiel);
			return await this.showScores(game, message);
		}
	}

	async showQuestion(game: Game, message: CommandoMessage): Promise<void> {
		const { round, totalRounds } = game;
		const {
			question,
			answer,
			alias,
			category,
			producerLocation,
		} = game.currentEmoji();
		const spiel = createMessage()
			.setTitle(`Guess the ${category.toLowerCase()}:`)
			.setDescription(question)
			.setFooter(
				`Hint: ${producerLocation}\n\nRound ${round + 1} of ${totalRounds}`
			);
		await message.channel.send(spiel);

		const filter = (m: CommandoMessage) =>
			game.participants.some(({ id }) => id === m.author.id);

		const collector = message.channel.createMessageCollector(filter, {
			time: +config.questionDuration,
		});

		collector.on('collect', async (m: CommandoMessage) => {
			const {
				content,
				author: { id: authorId },
			} = m;
			console.log(`Collected ${content}`);

			const isDone = game.currentEmoji().done;

			if (!isDone) {
				const c = content.trim().toLowerCase();
				const match = c === answer.toLowerCase();
				console.log('alias', alias);
				const aliasMatch =
					alias && alias.map((a) => a.toLowerCase()).includes(c);

				if (match || aliasMatch) {
					game.markDone();
					game.addScore(authorId);

					const spiel = createMessage().setDescription(
						`🏆 ${mentionUser(authorId)} got the correct answer: ${bold(
							answer.toUpperCase()
						)} 🏆`
					);

					collector.stop('answered');
					return await this.showNextQuestion(game, message, spiel);
				}
			}
		});

		collector.on('end', async (m, reason) => {
			console.log('endreason', reason);
			if (reason !== 'answered') {
				const spiel = createMessage()
					.setTitle("Time's Up!")
					.addField(
						bold(game.currentEmoji().answer.toUpperCase()),
						'was the correct answer'
					);

				await this.showNextQuestion(game, message, spiel);
			}
		});
	}

	async run(
		message: CommandoMessage,
		{ rounds }: EmojiGameArgType
	): AsyncCommandRunType {
		const emojis = await EmojiGameService.getAll();

		const game = new Game(shuffle(emojis), rounds);
		return this.gatherParticipants(game, message);
	}
}
