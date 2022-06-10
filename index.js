const { _PORT } = require('./config.js');
const app = require('./app.js');

app.listen(_PORT, () => {
	console.log(`Glossary management is running on port ${_PORT}`);
});
