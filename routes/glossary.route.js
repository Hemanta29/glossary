const {
	getAllTerm,
	addTerm,
	getTermById,
	editTerm,
	removeTerm,
} = require('../controllers/glossary.controller');
const { authGuard } = require('../middleware/auth')

module.exports = (app) => {
	app.get('/api/glossary', authGuard, async (req, res, next) => {
		try {
			const terms = await getAllTerm();
			res.send(terms);
		} catch (err) {
			next(err);
		}
	});
	app.post('/api/glossary', authGuard, async (req, res, next) => {
		try {
			const term = await addTerm(req.body);
			res.send(term);
		} catch (err) {
			next(err);
		}
	});
	app.get('/api/glossary/:id', authGuard, async (req, res, next) => {
		try {
			const data = await getTermById(req.params.id);
			res.send(data);
		} catch (err) {
			next(err);
		}
	});
	app.put('/api/glossary/:id', authGuard, async (req, res, next) => {
		try {
			const data = await editTerm(req.body, req.params.id);
			res.send(data);
		} catch (err) {
			next(err);
		}
	});
	app.delete('/api/glossary/:id', authGuard, async (req, res, next) => {
		try {
			const data = await removeTerm(req.params.id);
			res.send(data);
		} catch (err) {
			next(err);
		}
	});
};
