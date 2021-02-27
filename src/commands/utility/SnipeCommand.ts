import { GuildMember, Message } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { AsyncCommandRunType } from '../../typings';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import DeleteHistoryService from '../../services/DeleteHistoryService';
import { createEmbedMessage } from '../../util/MessageUtil';

type Response = {
	[key: string]: string;
};

type ArgType = {
	size: number;
};

export default class SnipeCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'snipe',
			memberName: 'snipe',
			args: [
				{
					key: 'size',
					prompt: 'ILAN BABARELEN MO MAMIII?',
					type: 'integer',
					default: 1,
					parse: (value: number) => (value > 5 ? 5 : value),
				},
			],
			aliases: ['sn', 'landi'],
			group: CommandGroup.UTILITY.name,
			description: 'Show recently deleted message',
		});
	}

	async run(
		message: CommandoMessage,
		{ size }: ArgType
	): AsyncCommandRunType {
		const response = await DeleteHistoryService.get(
			message.channel.id,
			size
		);
		const expiration = 180;

		if (response) {
			const endTime = new Date();
			const spiels = ((response as unknown) as Response[])
				.filter(({ createdTimestamp }) => {
					const startTime = new Date(createdTimestamp);

					const timeDiff =
						(endTime.getTime() - startTime.getTime()) / 1000;
					const seconds = Math.round(timeDiff);
					return seconds <= expiration;
				})
				.map(({ authorID, content, createdTimestamp }) => {
					const member = message.guild.member(
						authorID
					) as GuildMember;
					const { displayName: nickname, user } = member;
					const { username } = user;
					const avatar = user.displayAvatarURL({ format: 'png' });
					return createEmbedMessage('#0099ff')
						.setAuthor(nickname || username, avatar)
						.setDescription(content)
						.setTimestamp(+createdTimestamp);
				});

			if (spiels.length > 0) {
				const messages = ['Headshot!!!', ...spiels].map(
					(m) => (message.say(m) as unknown) as Message
				);
				return Promise.all(messages);
			}
		}

		return message.say(
			createEmbedMessage('#0099ff').setAuthor("There's nothing to snipe!")
		);
	}
}
