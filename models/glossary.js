const mongoose = require('mongoose');

const { Schema } = mongoose;

const GlossarySchema = new Schema({
	term: {
		type: String,
		required: [true, 'Term is required.'],
	},
	definition: {
		type: String,
		required: [true, 'Definiton is required.'],
	},
});

const Glossary = mongoose.model('glossary', GlossarySchema);

module.exports = Glossary;
