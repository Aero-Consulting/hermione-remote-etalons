const path = require('path');

const yandexAPI = require('./remote/yandexAPI');
const makeDir = require('./utils/makeDir');

module.exports = async (screenshotsDir, etalonsFolder) => {
	const localPathToScreenshots = path.normalize(
		`${process.cwd()}/${screenshotsDir}`
	);

	console.log(`[remote-etalons] making dir ${localPathToScreenshots}`);
	makeDir(localPathToScreenshots);

	console.log(`[remote-etalons][download] get etalons info`);
	const etalonsInfo = await yandexAPI.getAllEtalonsInfo(
		screenshotsDir,
		etalonsFolder
	);

	const pathsAndLinks = (ethalonInfo) => {
		const path = ethalonInfo.path.replace(`disk:/etalons/${etalonsFolder}`, '');
		const link = ethalonInfo.file;

		return {
			path,
			link,
		};
	};

	const etalonsPathAndLinks = etalonsInfo.map(pathsAndLinks);

	return downloadEtalons(etalonsPathAndLinks);
};

async function downloadEtalons (etalonsPathAndLinks) {
	const promises = [];

	for (const etalon of etalonsPathAndLinks) {
		console.log(`[remote-etalons][download] downloading ${etalon}`);
		promises.push(yandexAPI.downloadAndSaveEthalon(etalon));
	}

	try {
		return await Promise.allSettled(promises);
	} catch (e) {
		throw new Error(e);
	}
}
