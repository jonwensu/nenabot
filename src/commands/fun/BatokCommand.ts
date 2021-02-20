import { createCanvas, loadImage } from 'canvas';
import { MessageAttachment } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType, SingleUserArgType } from '../../typings';

const BATOK_IMG = `https://cdn.discordapp.com/attachments/749742357317943398/765113026843639828/palo.jpg`;
const WIDTH = 350;
const HEIGHT = 345;

const AVATAR_W = 100;
const AVATAR_H = 100;

const BATOKEE_W = 90;
const BATOKEE_H = 90;

export default class BatokCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'batok',
			memberName: 'batok',
			aliases: ['bt'],
			group: CommandGroup.FUN.name,
			description: 'Make batok someone',
			args: [
				{
					key: 'target',
					prompt: 'SINO BABATUKAN MO MAMIII?',
					type: 'user',
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ target }: SingleUserArgType
	): AsyncCommandRunType {
		const batoker = (w: number, h: number) => ({
			x: w * 0.08,
			y: h * 0.15,
		});
		const batokee = (w: number, h: number) => ({
			x: w * 0.98 - BATOKEE_W,
			y: h * 0.35,
		});

		const { author } = message;

		const canvas = createCanvas(WIDTH, HEIGHT);
		const ctx = canvas.getContext('2d');
		const background = await loadImage(BATOK_IMG);
		const batokerAvatar = await loadImage(
			author.displayAvatarURL({ format: 'png' })
		);
		const batokeeAvatar = await loadImage(
			target.displayAvatarURL({ format: 'png' })
		);

		const batokerDim = batoker(WIDTH, HEIGHT);
		const batokeeDim = batokee(WIDTH, HEIGHT);

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			batokerAvatar,
			batokerDim.x,
			batokerDim.y,
			AVATAR_W,
			AVATAR_H
		);
		ctx.drawImage(
			batokeeAvatar,
			batokeeDim.x,
			batokeeDim.y,
			BATOKEE_W,
			BATOKEE_H
		);

		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'batok.png'
		);

		return await message.channel.send(attachment);
	}
}
