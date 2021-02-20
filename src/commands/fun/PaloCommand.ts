import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import HotdogWeapon from '../../helper/weapon/HotdogWeapon';
import { AsyncCommandRunType } from '../../typings';
import { doRoll } from '../../util/RngUtil';

export default class PaloCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'palo',
			memberName: 'palo',
			aliases: ['pl'],
			group: CommandGroup.FUN.name,
			description: 'Make palo someone',
		});
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const hotdog = new HotdogWeapon(doRoll(5) + 1, this.client);
		const toothpick1 = this.getEmoji('toothpick3');
		const toothpick2 = this.getEmoji('toothpick2');
		const sticks = (item: string) => `${toothpick2}${item}${toothpick1}`;
		return await message.channel.send(sticks(hotdog.render()));
	}
}
