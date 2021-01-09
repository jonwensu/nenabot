import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import AnnounceCommand from '../../common/AnnounceCommand';
import { repeatMessage } from '../../util/MessageUtil';
import { CommandRunType } from '../../typings';

export default class WelcomeCommand extends AnnounceCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'welcome',
			memberName: 'welcome',
			aliases: ['wc'],
			group: CommandGroup.GENERAL.name,
			description: 'Welcome new kapotchis',
		});
	}

	run(message: CommandoMessage): CommandRunType {
		const potchi = this.getEmoji('potchi');
		const spiel = `WELCOME MGA KAPOTCHIII!!! SANA DI KAYO MAGING INACTIVE!!! ${repeatMessage(
			potchi
		)}`.trim();

		this.embed.description = spiel;

		return super.run(message);
	}
}
