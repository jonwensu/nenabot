import { createCanvas, loadImage } from 'canvas';
import { MessageAttachment } from 'discord.js';
import {
	Command as BaseCommand,
	CommandoClient,
	CommandoMessage,
} from 'discord.js-commando';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType, SingleUserArgType } from '../../typings';

const SABUNOT_IMG = `https://cdn.discordapp.com/attachments/765047137473265714/769803669875982366/Screen-Shot-2018-06-06-at-2.png`;

const WIDTH = 640;
const HEIGHT = 420;

const AVATAR_W = 70;
const AVATAR_H = 70;

const SABUNOTEE_W = 60;
const SABUNOTEE_H = 60;

const sabunoter = (w: number, h: number) => ({
	x: w * 0.1,
	y: h * 0.2,
});
const sabunotee = (w: number, h: number) => ({
	x: w * 0.03,
	y: h * 0.75,
});

export default class SabunotCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'sabunot',
			memberName: 'sabunot',
			aliases: ['sb'],
			group: CommandGroup.FUN.name,
			description: 'Make sabunot someone',
			args: [
				{
					key: 'target',
					prompt: 'SINO SASABUNUTAN MO MAMIII?',
					type: 'user',
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ target }: SingleUserArgType
	): AsyncCommandRunType {
		const { author } = message;

		const canvas = createCanvas(WIDTH, HEIGHT);
		const ctx = canvas.getContext('2d');
		const background = await loadImage(SABUNOT_IMG);
		const sabunoterAvatar = await loadImage(
			author.displayAvatarURL({ format: 'png' })
		);
		const sabunoteeAvatar = await loadImage(
			target.displayAvatarURL({ format: 'png' })
		);

		const sabunoterDim = sabunoter(WIDTH, HEIGHT);
		const sabunoteeDim = sabunotee(WIDTH, HEIGHT);

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			sabunoterAvatar,
			sabunoterDim.x,
			sabunoterDim.y,
			AVATAR_W,
			AVATAR_H
		);

		ctx.save();
		ctx.rotate((-30 * Math.PI) / 180);
		ctx.drawImage(
			sabunoteeAvatar,
			sabunoteeDim.x,
			sabunoteeDim.y,
			SABUNOTEE_W,
			SABUNOTEE_H
		);

		ctx.restore();

		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'sabunot.png'
		);

		return await message.channel.send(attachment);
	}
}
