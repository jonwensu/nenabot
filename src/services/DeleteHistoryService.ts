import BaseService from '../common/BaseService';
import { Message, PartialMessage } from 'discord.js';

interface ChannelMessage {
	[key: string]: string;
}

class DeleteHistoryService extends BaseService {
	async get(channelId: string, size = 1): Promise<Message[]> {
		try {
			const result = await this.httpClient.get(
				`/message/delete/${channelId}`,
				{ params: { size } }
			);

			const { data } = result;

			return Object.values(data);
		} catch {
			return [];
		}
	}

	async add(
		message: Message | PartialMessage
	): Promise<ChannelMessage | null> {
		try {
			const {
				channel: { id: channelId },
			} = message;
			const result = await this.httpClient.post(`/message/delete`, {
				message,
				channel: channelId,
			});

			const { data } = result;

			return (data as unknown) as ChannelMessage;
		} catch {
			return null;
		}
	}
}

export default new DeleteHistoryService();
