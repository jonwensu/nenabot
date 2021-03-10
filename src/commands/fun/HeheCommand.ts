import { GuildEmoji } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType } from '../../typings';

type EmojiPair = [string, string];
type EmojiIndexEntry = {
	aliases?: string[];
	emojis: [string, string][];
	regex?: RegExp[];
};
type EmojiIndex = {
	[key: string]: {
		aliases?: string[];
		emojis: [string, string][];
		regex?: RegExp[];
	};
};
type EmojiMap = {
	[key: string]: Pick<EmojiIndexEntry, 'aliases' | 'regex'> & {
		emojis: (string | GuildEmoji)[];
	};
};

const hehe: EmojiPair = ['heheBoye', '😈'];
const nice: EmojiPair = ['ab_nice', '👌'];
const baked: EmojiPair = ['pepeBaked', '👌'];
const char: EmojiPair = ['char', '🔥'];
const charizard: EmojiPair = ['charizard', '🔥'];
const charmeleon: EmojiPair = ['charmeleon', '🔥'];

const emojiIndex: EmojiIndex = {
	'69': {
		aliases: [
			'sixnine',
			'sixty nine',
			'sixty-nine',
			'sixtynine',
			'6ix 9ine',
			'6ix9ine',
		],
		emojis: [hehe, nice],
		regex: [
			new RegExp(
				`^(?!(${process.env.BOT_PREFIX})).*(?!(<[@!:][\\d\\w]*))69(?!([:\\w\\d]*>))`,
				'i'
			),
		],
	},
	hehe: {
		aliases: ['hehe'],
		emojis: [hehe],
	},
	nice: {
		aliases: ['nice', 'noice', 'nays'],
		emojis: [nice],
	},
	420: {
		aliases: ['sabog'],
		emojis: [baked],
		regex: [
			new RegExp(
				`^(?!(${process.env.BOT_PREFIX})).*(?!(<[@!:][\\d\\w]*))420(?!([:\\w\\d]*>))`,
				'i'
			),
		],
	},
	char: {
		aliases: [
			'charot',
			'charaught',
			'charotera',
			'chararat',
			'charawt',
			'charmander',
		],
		regex: [
			/((^[\s]*)|(^[\w\d\s]+[\s]+))char(((ot|awt)(era)?)|aught|arat|s)?(([\s]+[\w\d\s]*)|([\s]*)$)(lang)?/i,
		],
		emojis: [char],
	},
	charmeleon: {
		aliases: ['charmeleon'],
		emojis: [charmeleon],
	},
	charizard: {
		aliases: ['charizard'],
		regex: [/cha(r|w)iza(r|w)d/i],
		emojis: [charizard],
	},
};

function getJoinedRegex(
	entry: Pick<EmojiIndexEntry, 'aliases' | 'regex'>
): RegExp[] {
	const { aliases = [], regex = [] } = entry;
	return [...aliases.map((a) => new RegExp(a, 'i')), ...regex];
}

const joined: RegExp[] = Object.keys(emojiIndex).reduce(
	(prev: RegExp[], next) => [...prev, ...getJoinedRegex(emojiIndex[next])],
	[]
);
export default class HeheCommand extends BaseCommand {
	emojiMap: EmojiMap = {};
	constructor(client: CommandoClient) {
		super(client, {
			name: 'hehe',
			patterns: joined,
			memberName: 'reax',
			aliases: ['hh'],
			group: CommandGroup.FUN.name,
			description: 'HEHE',
		});
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const stripped = message.cleanContent.replace(
			new RegExp(/<[\w\d\s@:!]*>/, 'gi'),
			''
		);

		this.emojiMap = Object.keys(emojiIndex).reduce((prev, next: string) => {
			const { aliases = [], emojis, regex = [] } = emojiIndex[next];
			return {
				...prev,
				[next]: {
					regex,
					aliases,
					emojis: emojis.map(([emojiName, fallback]: EmojiPair) =>
						this.getEmoji(emojiName, fallback)
					),
				},
			};
		}, {});

		const emojis = Object.keys(this.emojiMap)
			.filter((k) => {
				return getJoinedRegex(this.emojiMap[k]).some((r) =>
					r.test(stripped.toLowerCase())
				);
			})
			.map((k) => this.emojiMap[k])
			.reduce(
				(prev: (string | GuildEmoji)[], next) => [
					...new Set([...prev, ...next.emojis]),
				],
				[]
			);

		await Promise.all(emojis.map(async (e) => await message.react(e)));

		return null;
	}
}
