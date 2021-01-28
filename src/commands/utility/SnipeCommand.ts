import { GuildEmoji, GuildMember, Message } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import { AsyncCommandRunType, PotchiArgType } from '../../typings';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import DeleteHistoryService from '../../services/DeleteHistoryService';
import { createEmbedMessage } from '../../util/MessageUtil';

type Response = {
	[key: string]: string;
};

export default class SnipeCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'snipe',
			memberName: 'snipe',
			aliases: ['sn'],
			group: CommandGroup.UTILITY.name,
			description: 'Show recently deleted message',
		});
	}

	async run(message: CommandoMessage): AsyncCommandRunType {
		const response = await DeleteHistoryService.get(message.channel.id);
		const expiration = 60;

		if (response) {
			const { authorID } = (response as unknown) as Response;
			const member = (await message.guild.member(authorID)) as GuildMember;

			const startTime = new Date(response.createdTimestamp);
			const endTime = new Date();
			const timeDiff = (endTime.getTime() - startTime.getTime()) / 1000;

			const seconds = Math.round(timeDiff);

			if (seconds <= expiration) {
				const { displayName: nickname, user } = member;
				const { username } = user;
				const avatar = await user.displayAvatarURL({ format: 'png' });

				const spiel = createEmbedMessage('#0099ff')
					.setAuthor(nickname || username, avatar)
					.setDescription(response.content)
					.setTimestamp(response.createdTimestamp);
				const messages = ['Headshot!!!', spiel].map(
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
