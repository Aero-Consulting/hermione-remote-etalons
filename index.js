const updateRefsCheck = require('./utils/updateRefsCheck');
const RuntimeConfig = require('./utils/runtime-config');
const etalonsHandler = require('./etalonsHandler');

module.exports = async (hermione, opts) => {
	if (!opts.enabled) {
		return;
	}

	updateRefsCheck(process.argv);

	const screenshotsDir = hermione.config.screenshotsDir;
	const updateRefs = RuntimeConfig.getInstance().updateRefs;
	const etalonFolder = opts.etalonFolder ? opts.etalonFolder : 'latest';

	// if update refs - handle at the end of
	const hermioneEvent = updateRefs
		? hermione.events.RUNNER_END
		: hermione.events.RUNNER_START;

	hermione.on(hermioneEvent, async () => {
		updateRefs
			? await etalonsHandler.updateEtalons(screenshotsDir)
			: await etalonsHandler.downloadEtalons(screenshotsDir, etalonFolder);
	});
};
