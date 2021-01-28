import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import Canvas from 'canvas';
import { Message, MessageAttachment, User } from 'discord.js';
import path from 'path';

import FontUtil from '../../util/FontUtil';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';

interface ArgType {
	text: string;
	author: User;
}

export default class QuoteCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'quote',
			aliases: ['qt'],
			group: CommandGroup.FUN.name,
			memberName: 'quote',
			description: 'Quote text in a fancy background',
			args: [
				{
					key: 'author',
					prompt: 'Who is the author of this quote?',
					type: 'user',
					default: (message: Message) => message.author,
				},
				{
					key: 'text',
					prompt: 'What would you like to quote?',
					type: 'string',
					default: 'This  is  a  sample  quote',
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ text, author }: ArgType
	): Promise<Message | Message[]> {
		const sanitized = text.trim().replace(/\s+/g, ' ');
		const fontSize = 60 - Math.floor(sanitized.length / 2);

		const out = `"${FontUtil.convert(sanitized)
			.split(' ')
			// .slice(0, 7)
			.join(' ')}"`;
		const WIDTH = 700;
		const HEIGHT = 500;
		const canvas = Canvas.createCanvas(WIDTH, HEIGHT);
		Canvas.registerFont(
			path.join(__dirname, '..', '..', 'assets', 'fonts', 'patrickhand.ttf'),
			{ family: 'PatrickHand' }
		);
		const ctx = canvas.getContext('2d');
		const background = await Canvas.loadImage(
			'https://media.discordapp.net/attachments/765047137473265714/804312383152455730/teahub.io-wallpaper-1360x768-hd-871496.png?width=1188&height=671'
		);

		ctx.fillStyle = '#1e1c1c';
		ctx.drawImage(background, 0, 0, WIDTH, HEIGHT);
		ctx.font = `italic bold ${fontSize}px PatrickHand`;
		const textDims = ctx.measureText(out);

		const textX = (WIDTH - textDims.width) * 0.5;
		const textY = HEIGHT * 0.45 - fontSize / 2;

		ctx.fillText(out, textX, textY);
		ctx.strokeText(out, textX, textY);

		ctx.font = `italic bold 30px PatrickHand`;
		const auth = `- ${author.username}, ${new Date().getFullYear()}`;
		const authDims = ctx.measureText(auth);
		const authX = (WIDTH - authDims.width) * 0.5;

		const authY = textY + 1.5 * fontSize;
		ctx.fillText(auth, authX, authY);
		ctx.strokeText(auth, authX, authY);

		const attachment = new MessageAttachment(canvas.toBuffer(), 'quote.png');

		return message.say(attachment);
	}
}
