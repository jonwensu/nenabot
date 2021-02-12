import { createCanvas, loadImage } from 'canvas';
import { Message, MessageAttachment, User } from 'discord.js';
import { CommandoClient, CommandoMessage } from 'discord.js-commando';
import BaseCommand from '../../common/BaseCommand';
import CommandGroup from '../../enums/CommandGroup';
import { AsyncCommandRunType } from '../../typings';

type ArgType = {
	img: string;
	firstTarget: User;
	secondTarget: User;
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
			target1: TargetType;
			target2: TargetType;
		};
	};
};

const KISS_IMG: KissType = {
	kith: {
		image: {
			url: `https://cdn.discordapp.com/attachments/765047137473265714/809791992845697096/hqdefault.png`,
			width: 480,
			height: 360,
		},
		avatar: {
			target1: {
				dimensions: {
					width: 40,
					height: 40,
				},
				coordinates: (w, h) => ({
					x: w * 0.4,
					y: h * 0.4,
				}),
			},
			target2: {
				dimensions: {
					width: 40,
					height: 40,
				},
				coordinates: function (w, h) {
					return {
						x: w * 0.47,
						y: h * 0.4,
					};
				},
			},
		},
	},
	kiss: {
		image: {
			url: `https://cdn.discordapp.com/attachments/765047137473265714/809808983665279017/iu.png`,
			width: 750,
			height: 585,
		},
		avatar: {
			target1: {
				dimensions: {
					width: 60,
					height: 60,
				},
				coordinates: (w, h) => ({
					x: w * 0.645,
					y: h * 0.52,
				}),
			},
			target2: {
				dimensions: {
					width: 65,
					height: 65,
				},
				coordinates: function (w, h) {
					return {
						x: w * 0.73,
						y: h * 0.58,
					};
				},
			},
		},
	},
};

export default class NowKissCommand extends BaseCommand {
	constructor(client: CommandoClient) {
		super(client, {
			name: 'now',
			memberName: 'now',
			group: CommandGroup.FUN.name,
			description: 'Make two people kiss',
			args: [
				{
					key: 'img',
					prompt: 'NOW WHAT MAMIII?',
					type: 'string',
					oneOf: Object.keys(KISS_IMG),
				},
				{
					key: 'firstTarget',
					prompt: 'SINO HAHALIKAN MO MAMIII?',
					type: 'user',
				},
				{
					key: 'secondTarget',
					prompt: 'SINO HAHALIKAN MO MAMIII?',
					type: 'user',
					default: (message: Message) => message.author,
				},
			],
		});
	}

	async run(
		message: CommandoMessage,
		{ img, firstTarget, secondTarget }: ArgType
	): AsyncCommandRunType {
		const template = KISS_IMG[img];
		const { image, avatar } = template;

		const canvas = createCanvas(image.width, image.height);
		const ctx = canvas.getContext('2d');
		const background = await loadImage(image.url);
		const firstTargetAvatar = await loadImage(
			firstTarget.displayAvatarURL({ format: 'png', size: 128 })
		);
		const secondTargetAvatar = await loadImage(
			secondTarget.displayAvatarURL({ format: 'png', size: 128 })
		);

		const target1Coords = avatar.target1.coordinates(
			image.width,
			image.height
		);
		const target2Coords = avatar.target2.coordinates(
			image.width,
			image.height
		);

		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
		ctx.drawImage(
			firstTargetAvatar,
			target1Coords.x,
			target1Coords.y,
			avatar.target1.dimensions.width,
			avatar.target1.dimensions.height
		);
		ctx.drawImage(
			secondTargetAvatar,
			target2Coords.x,
			target2Coords.y,
			avatar.target2.dimensions.width,
			avatar.target2.dimensions.height
		);

		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			'batok.png'
		);

		return await message.channel.send(attachment);
	}
}
