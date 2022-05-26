const fetch = require('node-fetch');

API_URL = process.env.YANDEX_API_URL
	? process.env.YANDEX_API_URL
	: 'https://cloud-api.yandex.net';

DISK_PATHNAME = process.env.DISK_PATHNAME
	? process.env.DISK_PATHNAME
	: '/v1/disk';

class YandexAPIRequester {
	constructor (authKey, moreOptions) {
		const url = new URL(`${API_URL}${DISK_PATHNAME}`);

		const defaultOptions = {
			headers: {
				Authorization: `OAuth ${authKey}`,
			},
			Accept: 'application/json',
		};

		const options = { ...defaultOptions, ...moreOptions };

		this.url = url;
		this.options = options;
	}

	async post (pathname, bodyData = null) {
		try {
			const response = await fetch(`${this.url.href}${pathname}`, {
				...this.options,
				method: 'POST',
				body: bodyData,
			});

			const data = await response.json();
			return data;
		} catch (e) {
			throw Error(e);
		}
	}

	async put (pathname = '', bodyData = null) {
		try {
			const response = await fetch(`${this.url.href}${pathname}`, {
				...this.options,
				method: 'PUT',
				body: bodyData,
			});

			const data = await response.json();
			return data;
		} catch (e) {
			throw Error(e);
		}
	}

	async get (pathname = '', query = '') {
		try {
			const response = await fetch(`${this.url.href}${pathname}${query}`, {
				...this.options,
				method: 'GET',
			});

			const data = await response.json();
			return data;
		} catch (e) {
			throw Error(e);
		}
	}
}

module.exports = YandexAPIRequester;
