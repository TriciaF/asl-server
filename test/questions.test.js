/* eslint-env mocha */
'use strict';
const {TEST_DATABASE_URL} = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {dbConnect, dbDisconnect} = require('../db-mongoose');
const {app} = require('../server');
const {User} = require('../users/models');

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
		User.remove({});
		return dbConnect(TEST_DATABASE_URL);
	});
  
	after(function() {
		return dbDisconnect();
	});

	beforeEach(function() {});

	afterEach(function() {
		return User.remove({});
	});
  
	describe('Test Quesiton endpoint', function () {
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
		});
	}); 
});