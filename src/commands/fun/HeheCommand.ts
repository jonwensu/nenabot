import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType } from '../../typings';

export default class HeheCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'hehe',
			hidden: true,
			patterns: [/69/],
			memberName: 'hehe',
			aliases: ['hh'],
			group: CommandGroup.FUN.name,
			description: 'React hehe whenever a message contains 69',
		});
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		await message.react(this.getEmoji('heheBoye', '😈'));

		return null;
	}
}
