/* eslint-env mocha */
'use strict';
const {TEST_DATABASE_URL} = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {dbConnect, dbDisconnect} = require('../db-mongoose');
const {app, runServer, closeServer} = require('../server');
const {Question} = require('../questions/models');


const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/user', function() {
	const image = 'exampleImage';
	const answer = 'exampleAnswer';
	const mValue = 'exampleValue';

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
  
	after(function() {
		return closeServer();
	});

	beforeEach(function() {});

	afterEach(function() {
		return Question.remove({});
	});
  
	describe('api/questions', function () {
		describe('POST', function() {
			it('Should reject if non-required field', function () {
				return chai
					.request(app)
					.post('/api/questions')
					.send({
						image,
						mValue
					})
					.then( () => {
						expect.fail(null, null, 'Request should not succeed');
					})
					.catch(err => {
						if ( err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing field');
						expect(res.body.location).to.equal('answer');
					});
			});
			it('Should create a Question object', function () {
				return chai
					.request(app)
					.post('api/questions')
					.send({
						image,
						answer,
						mValue
					})
					.then (res => {
						expect(res).to.have.status(201);
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.keys(
							'image',
							'answer',
							'mValue',
							'id'
						);
						expect(res.body.image).to.equal(image);
						expect(res.body.answer).to.equal(answer);
						expect(res.body.mValue).to.equal(mValue);
						return Question.findOne({image});
					})
					.then(question => {
						expect(question).to.not.be.null;
						expect(question.image).to.equal(image);
					})
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}
					});
			}); 
		});
	});
});