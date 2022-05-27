const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');

const YandexAPIRequester = require('./apiRequester');

let FOLDER_NAME = process.env.FOLDER_NAME;
FOLDER_NAME ||= '/etalons';

let AUTH_KEY = process.env.AUTH_KEY;
AUTH_KEY ||= 'AQAEA7qkFaN4AADLW-dUTe0IvkuFoWQfto8BsGU';

const apiRequester = new YandexAPIRequester(AUTH_KEY);

exports.createFolderRequest = async (folderPath) => {
	const fullPath = path.normalize(`${FOLDER_NAME}${folderPath}`);
	console.log(`[Yandex API Request] Creating folder ${folderPath}`);

	return await apiRequester.put(`/resources?path=${fullPath}`);
};

exports.getUploadLinkRequest = async (etalonPath) => {
	const uploadPath = path.normalize(`${FOLDER_NAME}${etalonPath}`);

	console.log(`[Yandex API Request] Get upload link for ${uploadPath}`);

	return await apiRequester.get(
		`/resources/upload?path=${uploadPath}`,
		'&overwrite=true'
	);
};

exports.postCopyRequest = async (fromPath, toPath) => {
	const fullFromPath = path.normalize(`${FOLDER_NAME}/${fromPath}`);
	const fullToPath = path.normalize(`${FOLDER_NAME}/${toPath}`);

	console.log(
		`[Yandex API Request] Copyng a ${fullFromPath} to ${fullToPath} folder`
	);

	return await apiRequester.post(
		`/resources/copy?from=${fullFromPath}&path=${fullToPath}&overwrite=true&force_async=true`
	);
};

exports.putUploadFileRequest = async (uploadLink, fullFilePath) => {
	const fileStat = fs.statSync(fullFilePath);
	const fileStream = fs.readFileSync(fullFilePath);

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

exports.getAllFiles = async (preFilesResponses = [], offset = 0) => {
	const response = await getFilesRequest(offset);

	const files = response.items;
	const reqLimit = response.limit;

	const allFilesResponses = [...preFilesResponses, ...files];

	// If limit is same as returned items - make another request with offset
	if (files.length === reqLimit)
		return getAllFilesRequests(allFilesResponses, reqLimit + offset);

	return allFilesResponses;
};

async function getFilesRequest (offset = 0) {
	console.log(
		`[Yandex API Request] Make all files request with offset ${offset}`
	);

	return await apiRequester.get(`/resources/files?limit=1000&offset=${offset}`);
}
