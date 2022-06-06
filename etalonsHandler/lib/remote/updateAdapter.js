const YandexAPI = require('./yandexAPI');
const remoteFoldersCreater = require('./utils/remoteFolderCreater');

exports.uploadFileToFolder = async (fullFilePath, etalonFolder) => {
	const filePathToUploadLink = fullFilePath.replace(process.cwd(), '');

	const uploadPath = `/${etalonFolder}${filePathToUploadLink}`;
	const uploadLinkData = await YandexAPI.getUploadLinkRequest(uploadPath);

	const uploadLink = uploadLinkData.href;

	return await YandexAPI.putUploadFileRequest(uploadLink, fullFilePath);
};

exports.copyLatestToTodayFolder = async () => {
	let today = new Date();
	let dateFolderName = `${today.getDate()}.${today.getMonth()}.${today.getFullYear()}`;

	console.log(`[remote-etalons] copying from 'latest' to '${dateFolderName}'`);

	return await YandexAPI.postCopyRequest('latest', dateFolderName);
};

exports.createEtalonFolders = async (folderPath, etalonFolder) => {
	const pathToLatest = `/${etalonFolder}${folderPath}`;

	return await remoteFoldersCreater(pathToLatest);
};
