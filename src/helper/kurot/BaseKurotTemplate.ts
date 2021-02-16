import { Message, MessageAttachment, User } from 'discord.js';
import { CommandoMessage } from 'discord.js-commando';

export default abstract class BaseKurotTemplate {
	target: User;

	constructor(target: User) {
		this.target = target;
	}
	abstract render(
		message: CommandoMessage | Message
	): Promise<MessageAttachment>;
}
