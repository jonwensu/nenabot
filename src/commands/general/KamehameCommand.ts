import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import AnnounceCommand from '../../common/AnnounceCommand';
import { CommandRunType } from '../../typings';

export default class KamehameCommand extends AnnounceCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'kamehame',
			memberName: 'kamehame',
			aliases: ['kamehameha', 'julenz'],
			hidden: true,
			group: CommandGroup.GENERAL.name,
			description: 'Kamehameha',
		});
	}

	run(message: CommandoMessage): CommandRunType {
		this.embed.title = 'Julenz FTW';
		this.embed.image = {
			url:
				'https://cdn.discordapp.com/attachments/765047137473265714/812522331343814697/kamehameha_s.gif',
		};

		return super.run(message);
	}
}
