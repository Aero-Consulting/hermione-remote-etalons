const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

const YandexAPI = require('./yandexAPI');
const makeDir = require('../utils/makeDir');

exports.getAllEtalonsInfo = async (screenshotsDir, etalonsFolder) => {
	let allFiles = await YandexAPI.getAllFiles();

	const byDirAndEthalons = (item) => {
		return item.path.includes(`${etalonsFolder}/${screenshotsDir}`);
	};

	return allFiles.filter(byDirAndEthalons);
};

exports.downloadAndSaveEthalon = async (ethalon) => {
	const screenshotPath = `${process.cwd()}${ethalon.path}`;
	const screenshotDir = path.dirname(screenshotPath);

	await makeDir(screenshotDir);

	const downloadEtalon = await fetch(ethalon.link);
	console.log(`Downloading etalon to ${screenshotPath}`);

	return await downloadEtalon.body.pipe(fs.createWriteStream(screenshotPath));
};
