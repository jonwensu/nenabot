import { CommandoClient } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import AnnounceCommand from '../../common/AnnounceCommand';

const spiel = `MAMIII MAY CHIKA AKO`;

export default class ChikaCommand extends AnnounceCommand {
	constructor(client: CommandoClient) {
		super(
			client,
			{
				name: 'chika',
				memberName: 'chika',
				aliases: ['ck'],
				group: CommandGroup.GENERAL.name,
				description: 'Inform your kapotchis that you have chika',
			},
			{
				title: spiel,
			}
		);
	}
}
