import BaseService from '../common/BaseService';
import { Message, PartialMessage } from 'discord.js';

interface ChannelMessage {
	[key: string]: string;
}

class DeleteHistoryService extends BaseService {
	async get(channelId: string): Promise<Message | null> {
		try {
			const result = await this.httpClient.get(
				`/message/delete/${channelId}`
			);

			const {
				data: { message },
			} = result;

			return message;
		} catch {
			return null;
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
