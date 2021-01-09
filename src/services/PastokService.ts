import { PastokGetAllResponse } from '../typings';
import BaseService from '../common/BaseService';

class PastokService extends BaseService {
	async getAll(): Promise<string[]> {
		try {
			const result = (await this.httpClient.get(
				'/pastok'
			)) as PastokGetAllResponse;

			const {
				data: { questions },
			} = result;

			return questions;
		} catch {
			return [];
		}
	}
}

export default new PastokService();
