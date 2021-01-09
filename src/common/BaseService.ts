import axios from 'axios';

import config from '../config.json';
const {
	api: { baseURL },
} = config;
export default class BaseService {
	httpClient = axios.create({ baseURL });
}
