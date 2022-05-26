const YandexAPI = require('./yandexAPI');
const makeDir = require('../utils/makeDir');

const path = require('path');

exports.getAllEtalonsInfo = async (screenshotsDir, etalonsFolder) => {
	let allFiles = await YandexAPI.getAllFilesRequests();

	const byDirAndEthalons = (item) => {
		return item.path.includes(`${etalonsFolder}/${screenshotsDir}`);
	};

	return allFiles.filter(byDirAndEthalons);
};

exports.downloadAndSaveEthalon = async (ethalon) => {
	const screenshotPath = `${process.cwd()}${ethalon.path}`;

	const screenshotDir = ethalon.path
		// Delete last slash in name if exist
		.replace(/([\/]+$)/, '')
		// Delete file name
		.replace(/([^\/]+$)/, '');

	const fullPathToDir = `${process.cwd()}${screenshotDir}`;

	makeDir(fullPathToDir);

	const downloadEtalon = await fetch(ethalon.link);

	return await downloadEtalon.body.pipe(fs.createWriteStream(screenshotPath));
};
