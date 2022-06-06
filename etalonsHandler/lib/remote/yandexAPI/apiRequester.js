const fetch = require('node-fetch');

API_URL = process.env.YANDEX_API_URL
	? process.env.YANDEX_API_URL
	: 'https://cloud-api.yandex.net';

DISK_PATHNAME = process.env.DISK_PATHNAME
	? process.env.DISK_PATHNAME
	: '/v1/disk';

class YandexAPIRequester {
	constructor (authKey) {
		const url = new URL(`${API_URL}${DISK_PATHNAME}`);

		const options = {
			headers: {
				Authorization: `OAuth ${authKey}`,
			},
			Accept: 'application/json',
		};

		this.url = url;
		this.options = options;
	}

	async #request (method, pathname = '', query = '', options = {}) {
		let requestParams = {
			method,
			...this.options,
			...options,
		};

		try {
			const response = await fetch(
				`${this.url.href}${pathname}${query}`,
				requestParams
			);

			const data = await response.json();
			return data;
		} catch (e) {
			throw Error(e);
		}
	}

	async post (pathName, body = null) {
		return this.#request('POST', pathName, '', { body });
	}

	async put (pathName, body = null) {
		return this.#request('PUT', pathName, '', { body });
	}

	async get (pathName, query = '') {
		const fullPathName = pathName + query;

		return await this.#request('GET', fullPathName);
	}
}

module.exports = YandexAPIRequester;
