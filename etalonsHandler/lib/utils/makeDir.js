const fs = require('fs');

module.exports = async function (dirPath) {
	console.log(`Check dir ${dirPath}`);
	if (!fs.existsSync(dirPath)) {
		console.log(`Dir not exist, creating`);
		return await fs.mkdirSync(dirPath, { recursive: true });
	}
	console.log(`Dir ${dirPath} exist!`);
};
