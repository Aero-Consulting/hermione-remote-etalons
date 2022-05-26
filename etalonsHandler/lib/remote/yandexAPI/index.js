const fs = require('fs');
const fetch = require('node-fetch');

const makeDir = require('../../utils/makeDir');

const YandexAPIRequester = require('./apiRequester');

let FOLDER_NAME = process.env.FOLDER_NAME;
FOLDER_NAME ||= '/etalons';

let AUTH_KEY = process.env.AUTH_KEY;
AUTH_KEY ||= 'AQAEA7qkFaN4AADLW-dUTe0IvkuFoWQfto8BsGU';

const apiRequester = new YandexAPIRequester(AUTH_KEY);

exports.createFolderRequest = async (path) => {
	const fullPath = `${FOLDER_NAME}${path}`;

	console.log(`[Yandex API Request] Creating folder ${path}`);

	return await apiRequester.put(`/resources?path=${fullPath}`);
};

exports.getUploadLinkRequest = async (path) => {
	const uploadPath = `${FOLDER_NAME}${path}`;

	console.log(`[Yandex API Request] Get upload link for ${uploadPath}`);

	return await apiRequester.get(
		`/resources/upload?path=${uploadPath}`,
		'&overwrite=true'
	);
};

exports.postCopyRequest = async (fromPath, toPath) => {
	const fullFromPath = `${FOLDER_NAME}/${fromPath}`;
	const fullToPath = `${FOLDER_NAME}/${toPath}`;

	console.log(
		`[Yandex API Request] Copyng a ${fullFromPath} to ${fullToPath} folder`
	);

	return await apiRequester.post(
		`/resources/copy?from=${fullFromPath}&path=${fullToPath}&overwrite=true&force_async=true`
	);
};

exports.putUploadFileRequest = async (uploadLink, fullFilePath) => {
	const fileStat = await fs.statSync(fullFilePath);
	const fileStream = await fs.readFileSync(fullFilePath);

	console.log(`[Yandex API Request] Upload File ${fullFilePath}`);

	try {
		const response = await fetch(uploadLink, {
			method: 'PUT',
			headers: {
				'Content-length': fileStat.size,
			},
			body: fileStream,
		});

		return response.ok;
	} catch (error) {
		throw Error(error);
	}
};

exports.getFilesRequest = async (offset = 0) => {
	console.log(
		`[Yandex API Request] Make all files request with offset ${offset}`
	);

	return await apiRequester.get(`/resources/files?limit=1000&offset=${offset}`);
};

exports.getAllFilesRequests = async (allFilesResponse = [], offset = 0) => {
	const response = await getFilesRequest(offset);

	const files = response.items;
	const reqLimit = response.limit;

	allFilesResponse.push(...response.items);

	// If limit is same as returned items - make another request with offset
	if (files.length === reqLimit)
		return getAllFilesRequests(allFilesResponse, reqLimit + offset);

	return allFilesResponse;
};
