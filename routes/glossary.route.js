const {
	getAllTerm,
	addTerm,
	getTermById,
	editTerm,
	removeTerm,
} = require('../controllers/glossary.controller');

module.exports = (app) => {
	app.get('/api/glossary', async (req, res, next) => {
		try {
			const terms = await getAllTerm();
			res.send({
				status: true,
				terms,
			});
		} catch (err) {
			next(err);
		}
	});
	app.post('/api/glossary', async (req, res, next) => {
		try {
			const term = await addTerm(req.body);
			res.send({
				status: true,
				term,
			});
		} catch (err) {
			next(err);
		}
	});
	app.get('/api/glossary/:id', async (req, res, next) => {
		try {
			const data = await getTermById(req.params.id);
			res.send({
				status: true,
				data,
			});
		} catch (err) {
			next(err);
		}
	});
	app.put('/api/glossary/:id', async (req, res, next) => {
		try {
			const data = await editTerm(req.body, req.params.id);
			res.send({
				status: true,
				data,
			});
		} catch (err) {
			next(err);
		}
	});
	app.delete('/api/glossary/:id', async (req, res, next) => {
		try {
			const data = await removeTerm(req.params.id);
			res.send({
				status: true,
				data,
			});
		} catch (err) {
			next(err);
		}
	});
};
