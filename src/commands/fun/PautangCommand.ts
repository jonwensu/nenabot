import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import AnnounceCommand from '../../common/AnnounceCommand';
import { CommandRunType, PautangArgType } from '../../typings';

export default class UtangComand extends AnnounceCommand {
	constructor(client: CommandoClient) {
		super(
			client,
			{
				name: 'pautang',
				memberName: 'pautang',
				args: [
					{
						key: 'item',
						prompt: 'ANO NA NAMAN UUTANGIN MO?',
						type: 'string',
						default: '',
					},
				],
				aliases: ['utang', 'ut'],
				group: CommandGroup.FUN.name,
				description: 'Mangutang sa tindahan',
			},
			{},
			true
		);
	}

	run(message: CommandoMessage, { item }: PautangArgType): CommandRunType {
		const multiEmoji = (emoji: string, quantity = 3) =>
			Array(quantity)
				.fill(undefined)
				.map(() => emoji)
				.join(' ');
		let spiel = `BAWAL UTANG!!! ${multiEmoji(':rage:')}`;

		if (item && item.toLowerCase() === 'nena') {
			spiel = `PAUTANG NENA MO RIN! ${multiEmoji(
				':face_with_symbols_over_mouth:'
			)}`;
		}

		this.embed.description = spiel;

		return super.run(message);
	}
}
