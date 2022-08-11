const mongoose = require('mongoose');
const Glossary = require('../models/glossary.model');

const getAllTerm = () => {
	return Glossary.find({});
};

const addTerm = (glossaryProps) => {
	return Glossary.findOne({ term: glossaryProps.term })
		.count()
		.exec()
		.then((count) => {
			if (count > 0) {
				return {
					status: false,
					message: 'This term is already present.',
				};
			} else {
				return Glossary.create(glossaryProps).then((term) => {
					return {
						message: 'A term added successfully.',
						data: term,
					};
				});
			}
		});
};

const getTermById = async (termId) => {
	termId = mongoose.Types.ObjectId(termId);
	const term = await Glossary.findById(termId);
	if (term === null) {
		return {
			message: 'No term is present with this ID',
		};
	} else {
		return term;
	}
};

const editTerm = async (props, id) => {
	const glossaryProps = props;
	const termId = id;
	const term = await Glossary.findByIdAndUpdate(
		{
			_id: termId,
		},
		glossaryProps
	)
	if (term === null) {
		return {
			message: 'No term is present with this ID',
		};
	} else {
		return {
			message: 'A term updated successfully.',
			term,
		};
	}
};

const removeTerm = async (id) => {
	const termId = id;
	const term = await Glossary.findByIdAndRemove({
		_id: termId,
	});
	if (term === null) {
		return {
			message: 'This term is not present in the database.',
		};
	} else {
		return {
			message: 'A term removed successfully.',
			data: term,
		};
	}
};

module.exports = {
	getAllTerm,
	addTerm,
	getTermById,
	editTerm,
	removeTerm,
};
