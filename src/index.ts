import { CommandoClient } from 'discord.js-commando';
import path from 'path';
import DeleteHistoryService from './services/DeleteHistoryService';
import { ConfigType } from './typings';

import config from './config';
import CommandGroup from './enums/CommandGroup';
import { Message, PartialMessage } from 'discord.js';

const client = new CommandoClient({
	...config,
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.registry
	.registerDefaultTypes()
	.registerGroups(
		Object.values(CommandGroup).map(({ name, description }) => [
			name,
			description,
		])
	)
	.registerDefaultGroups()
	.registerDefaultCommands({ unknownCommand: false })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
	const {
		activity: { name, type },
	} = (config as unknown) as ConfigType;
	console.log(`Logged in as ${client.user?.tag}! (${client.user?.id})`);
	client.user?.setActivity(name, { type });
});

client.on('error', console.error);

client.on(
	'messageDelete',
	async (message: Message | PartialMessage) =>
		await DeleteHistoryService.add(message)
);

client.login(config.token);
