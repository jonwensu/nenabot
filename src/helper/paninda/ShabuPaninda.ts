import { CommandoMessage } from 'discord.js-commando';
import { bold, mentionAuthor } from '../../util/MessageUtil';
import Paninda from './Paninda';

export default class ShabuPaninda extends Paninda {
	constructor() {
		super('Shabu :smiling_imp:', ['shabu', 'asukal', 'asin'], 420, 30);
	}
	onSuccess(): void {
		throw new Error('Method not implemented.');
	}
	onFail(): void {
		throw new Error('Method not implemented.');
	}

	successSpiel(message: CommandoMessage): string {
		return `Bumili si ${mentionAuthor(message)} ng ${bold(
			`SHABU`
		)} dali dali nyang itinago ito sa kanyang bulsa`;
	}
	failSpiel(message: CommandoMessage): string {
		return `Nahuli ng mga pulis si ${mentionAuthor(
			message
		)} hawak hawak ang ${bold(`SHABU`)}. Himas rehas sya ngayon.`;
	}
}
