const {
	getAllTerm,
	addTerm,
	getTermById,
	editTerm,
	removeTerm,
} = require('../controllers/glossary.js');

module.exports = (app) => {
	app.get('/api/glossary', getAllTerm);
	app.post('/api/glossary', addTerm);
	app.get('/api/glossary/:id', getTermById);
	app.put('/api/glossary/:id', editTerm);
	app.delete('/api/glossary/:id', removeTerm);
};
