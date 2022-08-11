var sinon = require('sinon');
var { expect } = require('chai');
var assert = require('assert');

var mongoose = require('mongoose');
require('sinon-mongoose');

//Importing our glossary model for our unit testing.
var GlossaryModel = require('../models/glossary.model');
var GlossaryController = require('../controllers/glossary.controller');

describe('Get all glossary terms', function () {
	before(() => { });

	afterEach(() => {
		sinon.restore();
	});
	// Test will pass if we get all glossary terms
	const GlossaryMock = sinon.mock(GlossaryModel);

	it('should return all glossary terms', async () => {
		const stubValue = {
			status: true,
			glossary: [
				{
					term: 'Apple',
					description: 'A fruit',
				},
			],
		};
		const stub = sinon.stub(GlossaryModel, 'find').returns(stubValue);
		const glossary = await GlossaryController.getAllTerm();
		expect(stub.calledOnce).to.be.true;
		expect(glossary.term).to.equal(stubValue.term);
	});

	it('should not add the term if it already present in db', async () => {
		const stubValue = {
			status: false,
			message: 'This term is already present.',
		};

		GlossaryMock.expects('findOne')
			.withArgs({ term: 'Apple' })
			.chain('count')
			.chain('exec')
			.resolves(1);
		GlossaryController.addTerm({ term: 'Apple' }).then(function (result) {
			if (result > 0) {
				GlossaryMock.verify();
				GlossaryMock.restore();
				assert.equal(stubValue, result);
			}
		});
		// expect(stub.calledOnce).to.be.true;
		// expect(glossary.message).to.equal(stubValue.message);
	});

	it('should add a term into glossary list', async () => {
		const stubValue = {
			message: 'A term added successfully.',
			data: {
				term: 'Banana',
				description: 'A fruit',
			},
		};
		GlossaryMock.expects('findOne')
			.withArgs({ term: 'Banana' })
			.chain('count')
			.chain('exec')
			.resolves(0);

		GlossaryMock.expects('create')
			.withArgs({ term: 'Banana', description: 'A fruit' })
			.resolves(stubValue);

		GlossaryController.addTerm({
			term: 'Banana',
			description: 'A fruit',
		}).then(function (result) {
			GlossaryMock.verify();
			GlossaryMock.restore();
			assert.equal(stubValue, result);
		});
	});



	it('should not return a term from glossary list if that term is not present in DB', async () => {
		const termId = mongoose.Types.ObjectId('62a2b6322e5a049103a6335b');
		const resData = {
			message: 'No term is present with this ID',
		};
		sinon.stub(GlossaryModel, 'findById').returns(null);
		const result = await GlossaryController.getTermById(termId);
		GlossaryMock.verify();
		GlossaryMock.restore();
		expect(result).to.deep.equal(resData);
	});

	it('should return a term from glossary list', async () => {
		const termId = mongoose.Types.ObjectId('62a2b6322e5a049103a6335b');
		const stubValue = {
			_id: '62a2b6322e5a049103a6335b',
			term: 'Apple',
			definition: 'A healthy fruit.',
			__v: 0,
		};
		sinon.stub(GlossaryModel, 'findById').returns(stubValue);
		const result = await GlossaryController.getTermById(termId);
		GlossaryMock.verify();
		GlossaryMock.restore();
		expect(result).to.deep.equal(stubValue);
	});


	it('should not update a term from glossary list if that term is not present in DB', async () => {
		const termId = mongoose.Types.ObjectId('62a2b6322e5a049103a6335b');
		const props = {
			"term": "Banana",
			"definition": "A healthy fruit."
		}
		const resData = {
			message: 'No term is present with this ID',
		};
		sinon.stub(GlossaryModel, 'findByIdAndUpdate').withArgs({
			_id: termId,
		}, props).returns(null);
		const result = await GlossaryController.editTerm(props, termId);
		GlossaryMock.verify();
		GlossaryMock.restore();
		expect(result).to.deep.equal(resData);
	});

	it('should update a term from glossary list', async () => {
		const termId = mongoose.Types.ObjectId('62a2b6322e5a049103a6335b');
		const props = {
			"term": "Banana",
			"definition": "A healthy fruit."
		}
		const stubValue = {
			"_id": "62a2baded2aab3f0896beef5",
			"term": "Banana",
			"definition": "A healthy fruit.",
			"__v": 0
		}
		sinon.stub(GlossaryModel, 'findByIdAndUpdate').withArgs({
			_id: termId,
		}, props).returns(stubValue);
		const result = await GlossaryController.editTerm(props, termId);
		GlossaryMock.verify();
		GlossaryMock.restore();
		expect(result.term).to.deep.equal(stubValue);
	});


	it('should not remove a term from glossary list if that term is not present in DB', async () => {
		const termId = mongoose.Types.ObjectId('62a2b6322e5a049103a6335b');
		const resData = {
			message: 'This term is not present in the database.',
		};
		sinon.stub(GlossaryModel, 'findByIdAndRemove').withArgs({
			_id: termId,
		}).returns(null);
		const result = await GlossaryController.removeTerm(termId);
		GlossaryMock.verify();
		GlossaryMock.restore();
		expect(result).to.deep.equal(resData);
	});

	it('should remove a term from glossary list', async () => {
		const termId = mongoose.Types.ObjectId('62a2b6322e5a049103a6335b');

		const stubValue = {
			"_id": "62a2baded2aab3f0896beef5",
			"term": "Banana",
			"definition": "A healthy fruit.",
			"__v": 0
		}
		sinon.stub(GlossaryModel, 'findByIdAndRemove').withArgs({
			_id: termId,
		}).returns(stubValue);
		const result = await GlossaryController.removeTerm(termId);
		GlossaryMock.verify();
		GlossaryMock.restore();
		expect(result.data).to.deep.equal(stubValue);
	});


});
