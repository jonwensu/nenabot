import { GuildEmoji } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType } from '../../typings';

export default class HeheCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'hehe',
			hidden: true,
			patterns: [/[\w\d]+/],
			memberName: 'hehe',
			aliases: ['hh'],
			group: CommandGroup.FUN.name,
			description: 'React hehe whenever a message contains 69',
		});
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const stripped = message.cleanContent.replace(/<[\w\d\s@:!]*>/, '');

		const hehe = this.getEmoji('heheBoye', '😈');
		const nice = this.getEmoji('ab_nice', '👌');
		const baked = this.getEmoji('pepeBaked', '👌');
		type EmojiMap = {
			[key: string]: {
				aliases: string[];
				emojis: (string | GuildEmoji)[];
			};
		};
		const emojiMap: EmojiMap = {
			'69': {
				aliases: ['sixnine', 'sixty nine', 'sixtynine'],
				emojis: [hehe, nice],
			},
			hehe: {
				aliases: [],
				emojis: [hehe],
			},
			nice: {
				aliases: ['noice', 'nays'],
				emojis: [nice],
			},
			'420': {
				aliases: [],
				emojis: [baked],
			},
		};

		const emojis = Object.keys(emojiMap)
			.filter((k) => {
				const { aliases } = emojiMap[k];

				const matchAlias = aliases?.some((a) =>
					stripped.toLowerCase().includes(a.toLowerCase())
				);
				return stripped.toLowerCase().includes(k) || matchAlias;
			})
			.map((k) => emojiMap[k])
			.reduce(
				(prev: (string | GuildEmoji)[], next) => [
					...new Set([...prev, ...next.emojis]),
				],
				[]
			);

		console.log(emojis);

		await Promise.all(emojis.map(async (e) => await message.react(e)));

		return null;
	}
}
