import axios from 'axios';

import config from '../config';
const {
	api: { baseURL },
} = config;
export default class BaseService {
	httpClient = axios.create({ baseURL });
}
