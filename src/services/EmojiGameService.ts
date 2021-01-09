import { EmojiGameQuestion, EmojiGetAllResponse } from '../typings';
import BaseService from '../common/BaseService';

class EmojiGameService extends BaseService {
	async getAll(): Promise<EmojiGameQuestion[]> {
		try {
			const result = (await this.httpClient.get(
				'/emoji'
			)) as EmojiGetAllResponse;

			const {
				data: { questions },
			} = result;

			return questions;
		} catch {
			return [];
		}
	}
}

export default new EmojiGameService();
