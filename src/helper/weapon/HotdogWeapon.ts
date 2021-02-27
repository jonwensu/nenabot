import { GuildEmoji } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { WeaponUpgrades } from '../../typings';
import { repeatMessage } from '../../util/MessageUtil';
import { pick } from '../../util/RngUtil';
import Weapon from './Weapon';

const emojis = {
	small: 'hotdogSmol',
	start: 'hotdog1',
	mid: 'hotdog2',
	end: 'hotdog3',
	top: 'marshmallowPink',
	bottom: 'marshmallowWhite',
};

export default class HotdogWeapon extends Weapon {
	upgrades: WeaponUpgrades = {
		damage: 10,
		critChance: 10,
	};
	constructor(length: number, client: CommandoClient) {
		super(length, emojis, '🟥', client);
	}

	render(): string {
		const { start, mid, end, top, bottom, small } = this.emojis;

		const marshmallow = () => {
			const pool = [top, bottom, null];
			const chosen = pick(pool);
			return chosen || '';
		};

		// const result = Array(this.length)
		// 	.fill(undefined)
		// 	.map((_) => pick(['marshmallow', 'hakdog']))
		// 	.reduce(
		// 		(
		// 			prev: (GuildEmoji | string)[],
		// 			next: string,
		// 			i: number,
		// 			arr: string[]
		// 		) => {
		// 			if (next === 'marshmallow') {
		// 				return [...prev, marshmallow()];
		// 			}

		// 			const getHakdog = () => {
		// 				const prevEmoji = prev[prev.length - 1];
		// 				const nextEmoji = prev[i + 1];
		// 				if (!prevEmoji) {
		// 					return start;
		// 				}

		// 				if (i === arr.length - 1 || arr[i + 1] !== 'hakdog') {
		// 					return end;
		// 				}

		// 				return mid;
		// 			};
		// 			return [...prev, getHakdog()];
		// 		},
		// 		[]
		// 	);

		const hakdog = (length: number) =>
			length === 1
				? small
				: `${start}${repeatMessage(mid, length, '')}${end}`;
		return `${marshmallow()}${hakdog(this.length)}${marshmallow()}`;
	}
}
