// const { _PORT } = require('./config.js');

const dotenv = require('dotenv');
const app = require('./app.js');

dotenv.config();
const _PORT = process.env.PORT || 9001;

app.listen(_PORT, () => {
	console.log(`----- Server running on port ${_PORT} --------`);
});
