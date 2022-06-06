const fs = require('fs');

module.exports = function (dirPath) {
	console.log(`Check dir ${dirPath}`);

	if (fs.existsSync(dirPath)) {
		console.log(`Dir ${dirPath} exist, delete it`);
		fs.rmSync(dirPath, { recursive: true });
	}

	console.log(`Creating ${dirPath}`);
	return fs.mkdirSync(dirPath, { recursive: true });
};
