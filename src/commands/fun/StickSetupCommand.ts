import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import HotdogWeapon from '../../helper/weapon/HotdogWeapon';
import { AsyncCommandRunType } from '../../typings';

export default class StickCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'sticksetup',
			hidden: true,
			memberName: 'sticksetup',
			aliases: ['sts'],
			group: CommandGroup.FUN.name,
			description: 'Build a stick',
		});
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const hotdog = new HotdogWeapon(0, this.client);
		const toothpick1 = this.getEmoji('toothpick3');
		const toothpick2 = this.getEmoji('toothpick2');
		const sticks = (item: string) => `${toothpick2}${item}${toothpick1}`;
		return await message.channel.send(sticks(hotdog.render()));
	}
}
