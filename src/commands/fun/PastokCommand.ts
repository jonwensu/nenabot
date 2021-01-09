import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

import CommandGroup from '../../enums/CommandGroup';
import PastokService from '../../services/PastokService';
import {
	AsyncCommandRunType,
	PastokRecentQuestionType,
	SingleUserArgType,
} from '../../typings';
import { createEmbedMessage } from '../../util/MessageUtil';
import { pick } from '../../util/RngUtil';

export default class PastokCommand extends Command {
	recent: PastokRecentQuestionType[] = [];

	constructor(client: CommandoClient) {
		super(client, {
			name: 'pastok',
			memberName: 'pastok',
			aliases: ['pt', 'ft', 'fasttalk'],
			group: CommandGroup.FUN.name,
			description: 'TWBA style fast talk',
			guildOnly: true,
			args: [
				{
					key: 'target',
					prompt: 'SINO TATANUNGIN MO MAMIII?',
					type: 'user',
					default: (message: Message) => message.author,
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ target }: SingleUserArgType
	): AsyncCommandRunType {
		const { guild } = message;
		const { username } = target;

		const pool = await PastokService.getAll();
		const member = guild.member(target);
		const nickname = member?.displayName;
		const filtered = pool.filter(
			(p) =>
				!this.recent
					.map(({ question }) => question.toLowerCase().trim())
					.includes(p.toLowerCase().trim())
		);

		this.recent = this.recent
			.map(({ cooldown, ...r }) => ({ cooldown: +cooldown - 1, ...r }))
			.filter(({ cooldown }) => cooldown > 0);

		const activeQ = pick(filtered).trim().toUpperCase();

		const cd = Math.floor(pool.length * 0.4);

		this.recent.push({
			question: activeQ,
			cooldown: cd,
		});

		const spiel = createEmbedMessage('#0099ff', `${activeQ}?`)
			.setAuthor(
				`${nickname || username}, IKAW NA!`,
				'https://cdn.discordapp.com/attachments/765047137473265714/768419284765507634/tito_boy.png'
			)
			.setThumbnail(target.displayAvatarURL({ format: 'png' }));
		return message.channel.send(spiel);
	}
}
