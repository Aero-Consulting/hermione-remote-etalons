const YandexAPI = require('./../yandexAPI');

const pathExistError = 'DiskPathPointsToExistentDirectoryError';
const pathNotExistError = 'DiskPathDoesntExistsError';

module.exports = async function foldersCreater (
	pathToCreate,
	dirsToCreate = [],
	goodResponses = []
) {
	const response = await YandexAPI.createFolderRequest(pathToCreate);

	if (response.error == pathExistError) {
		console.log(`[Yandex API Request] Folder ${pathToCreate} exist!`);
		return;
	}

	if (response.error == pathNotExistError) {
		console.log(
			`[Yandex API Request] Folder ${pathToCreate} not exist! 
                Lets try one folder behind`
		);

		dirsToCreate.push(pathToCreate);

		const newPath = pathToCreate.substring(0, pathToCreate.lastIndexOf('/'));

		return await foldersCreater(newPath, dirsToCreate, goodResponses);
	}

	goodResponses.push(response);

	for await (const folder of dirsToCreate.reverse()) {
		const response = await YandexAPI.createFolderRequest(folder);
		goodResponses.push(response);
	}

	return goodResponses;
};
