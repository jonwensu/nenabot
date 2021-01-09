/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	GuildEmoji,
	Message,
	MessageEmbed,
	MessageEmbedOptions,
} from 'discord.js';
import { Command } from 'discord.js-commando';
import { getEmoji } from '../util/MessageUtil';

export default class BaseCommand extends Command {
	getEmoji(
		emojiName: string,
		fallback: string | GuildEmoji = ''
	): GuildEmoji | string {
		return getEmoji(this.client, emojiName, fallback);
	}
}
