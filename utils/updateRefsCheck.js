const RuntimeConfig = require('./runtime-config');

module.exports = function (argv) {
	const updateRefs = argv.includes('--update-refs');

	RuntimeConfig.getInstance().extend({ updateRefs });
};
