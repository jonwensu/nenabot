import { CommandoClient } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import AnnounceCommand from '../../common/AnnounceCommand';

const spiel = 'BRB ACADS MUNA AKO MAMIII';
const gif = `https://media1.tenor.com/images/f3c17c5ab1efca8e1cce4b8b6dd88228/tenor.gif?itemid=12999722`;

export default class AcadsCommand extends AnnounceCommand {
	constructor(client: CommandoClient) {
		super(
			client,
			{
				name: 'acads',
				memberName: 'acads',
				aliases: ['ac'],
				group: CommandGroup.GENERAL.name,
				description: 'Magpaalam sa mga kapotchi mo na mag acads ka muna',
			},
			{
				title: spiel,
				image: { url: gif },
			}
		);
	}
}
