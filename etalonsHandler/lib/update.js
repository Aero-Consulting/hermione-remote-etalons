const path = require('path');

const updateAdapter = require('./remote/updateAdapter');
const walkSync = require('./utils/walkSync');

module.exports = async (screenshotsDir) => {
	console.log('[remote-etalons] Updating etalons from remote');

	const localPathToScreenshots = `${process.cwd()}/${screenshotsDir}`;

	const localEtalonPaths = [];
	const dirsPathsSet = new Set();

	for (let localEthalonPath of walkSync(localPathToScreenshots)) {
		localEthalonPath = path.normalize(localEthalonPath);

		if (/(^|\/)\.[^\/\.]/g.test(localEthalonPath)) continue; // skip hidden files

		localEtalonPaths.push(localEthalonPath);

		const dirPath = path.dirname(localEthalonPath).replace(process.cwd(), '');
		dirsPathsSet.add(dirPath);
	}

	for (const dirPath of dirsPathsSet) {
		await updateAdapter.createEtalonFolders(dirPath);
	}

	console.log('[remote-etalons] uploading folders');
	const promises = localEtalonPaths.map((i) =>
		updateAdapter.uploadFileToLatestFolder(i)
	);

	const uploadResults = await Promise.all(promises);

	await updateAdapter.copyLatestToTodayFolder();

	return uploadResults;
};
