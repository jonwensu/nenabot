import { User } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import BoyKurotTemplate from '../../helper/kurot/BoyKurotTemplate';
import GirlKurotTemplate from '../../helper/kurot/GirlKurotTemplate';
import { AsyncCommandRunType } from '../../typings';
import { pick } from '../../util/RngUtil';

type ArgType = {
	target: User;
};

type Dimensions = {
	width: number;
	height: number;
};

type Coordinates = {
	x: number;
	y: number;
};

type TargetType = {
	dimensions: Dimensions;
	coordinates: (w: number, h: number) => Coordinates;
};

type KissType = {
	[key: string]: {
		image: Dimensions & {
			url: string;
		};
		avatar: {
			target: TargetType;
		};
	};
};

export default class KurotCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'kurot',
			memberName: 'kurot',
			group: CommandGroup.FUN.name,
			description: 'Kurutin ang kapotchi',
			args: [
				{
					key: 'target',
					prompt: 'SINO KUKURUTIN MO MAMIII?',
					type: 'user',
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ target }: ArgType
	): AsyncCommandRunType {
		const template = pick([BoyKurotTemplate, GirlKurotTemplate]);
		// const attachment = await new GirlKurotTemplate(target).render(message);
		const attachment = await new template(target).render(message);

		return await message.channel.send(attachment);
	}
}
