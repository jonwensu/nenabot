import { GuildEmoji } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType } from '../../typings';

type EmojiMap = {
	[key: string]: {
		aliases: string[];
		emojis: (string | GuildEmoji)[];
	};
};

export default class HeheCommand extends BaseCommand {
	emojiMap: EmojiMap;

	constructor(client: CommandoClient) {
		// const hehe = this.getEmoji('heheBoye', '😈');
		// const nice = this.getEmoji('ab_nice', '👌');
		// const baked = this.getEmoji('pepeBaked', '👌');
		super(client, {
			name: 'hehe',
			hidden: true,
			// patterns: [/[\w\d]+/],
			memberName: 'hehe',
			aliases: ['hh'],
			group: CommandGroup.FUN.name,
			description: 'React hehe whenever a message contains 69',
		});
		this.emojiMap = {
			'69': {
				aliases: ['sixnine', 'sixty nine', 'sixtynine'],
				emojis: ['hehe', 'nice'],
			},
			hehe: {
				aliases: [],
				emojis: ['hehe'],
			},
			nice: {
				aliases: ['noice', 'nays'],
				emojis: ['nice'],
			},
			'420': {
				aliases: [],
				emojis: ['baked'],
			},
		};
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const stripped = message.cleanContent.replace(/<[\w\d\s@:!]*>/, '');

		const emojis = Object.keys(this.emojiMap)
			.filter((k) => {
				const { aliases } = this.emojiMap[k];

				const matchAlias = aliases?.some((a) =>
					stripped.toLowerCase().includes(a.toLowerCase())
				);
				return stripped.toLowerCase().includes(k) || matchAlias;
			})
			.map((k) => this.emojiMap[k])
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
