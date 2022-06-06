const path = require('path');

const downloadAdapter = require('./remote/downloadAdapter');
const makeDir = require('./utils/makeDir');

module.exports = async (screenshotsDir, etalonsFolder) => {
	const localPathToScreenshots = path.normalize(
		`${process.cwd()}/${screenshotsDir}`
	);

	console.log(`[remote-etalons] making dir ${localPathToScreenshots}`);
	makeDir(localPathToScreenshots);

	console.log(`[remote-etalons][download] get etalons info`);
	const etalonsInfo = await downloadAdapter.getAllEtalonsInfo(
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

	const promises = etalonsPathAndLinks.map((i) =>
		downloadAdapter.downloadAndSaveEthalon(i)
	);

	return await Promise.all(promises);
};
