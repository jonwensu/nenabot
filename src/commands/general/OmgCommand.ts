import { CommandoClient } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import AnnounceCommand from '../../common/AnnounceCommand';

const spiel = `OMG MAMIII BAKIT KA?!`;

export default class OmgCommand extends AnnounceCommand {
	constructor(client: CommandoClient) {
		super(
			client,
			{
				name: 'omg',
				memberName: 'omg',
				group: CommandGroup.GENERAL.name,
				description: 'OMG GETS MO NA TO MAMIII',
			},
			{
				title: spiel,
			}
		);
	}
}
