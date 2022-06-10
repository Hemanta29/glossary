const mongoose = require('mongoose');
const Glossary = require('../models/glossary.js');

const getAllTerm = (req, res, next) => {
	Glossary.find({})
		.then((terms) => {
			res.send(terms);
		})
		.catch(next);
};

const addTerm = (req, res, next) => {
	const glossaryProps = req.body;
	Glossary.findOne({ term: req.body.term })
		.count()
		.then((count) => {
			if (count > 0) {
				res.send({
					message: 'This term is already present.',
				});
			} else {
				Glossary.create(glossaryProps)
					.then((term) => {
						res.send({
							message: 'A term added successfully.',
							data: term,
						});
					})
					.catch(next);
			}
		})
		.catch(next);
};

const getTermById = (req, res, next) => {
	let termId = req.params.id;
	termId = mongoose.Types.ObjectId(termId);
	Glossary.findById(termId)
		.then((term) => {
			if (term === null) {
				res.send({
					message: 'No term is present with this ID',
				});
			}
			res.send(term);
		})
		.catch(next);
};

const editTerm = (req, res, next) => {
	const glossaryProps = req.body;
	const termId = req.params.id;
	Glossary.findByIdAndUpdate(
		{
			_id: termId,
		},
		glossaryProps
	)
		.then(() =>
			Glossary.findById({
				_id: termId,
			})
		)
		.then((term) => {
			if (term === null) {
				res.send({
					message: 'No term is present with this ID',
				});
			} else {
				res.send({
					message: 'A term updated successfully.',
					data: term,
				});
			}
		})
		.catch(next);
};

const removeTerm = (req, res, next) => {
	const termId = req.params.id;
	Glossary.findByIdAndRemove({
		_id: termId,
	})
		.then((term) => {
			if (term === null) {
				res.send({
					message: 'This term is not present in the database.',
				});
			} else {
				res.send({
					message: 'A term removed successfully.',
					data: term,
				});
			}
		})
		.catch(next);
};

module.exports = {
	getAllTerm,
	addTerm,
	getTermById,
	editTerm,
	removeTerm,
};
