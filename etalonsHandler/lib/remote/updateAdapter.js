const YandexAPI = require('./yandexAPI');
const remoteFoldersCreater = require('./utils/remoteFolderCreater');

exports.uploadFileToLatestFolder = async (fullFilePath) => {
	const filePathToUploadLink = fullFilePath.replace(process.cwd(), '');

	const uploadPath = `/latest${filePathToUploadLink}`;
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

exports.createEtalonFolders = async (folderPath) => {
	const pathToLatest = `/latest${folderPath}`;

	return await remoteFoldersCreater(pathToLatest);
};
