/* eslint-env mocha */
'use strict';
const {TEST_DATABASE_URL} = require('../config');
const chai = require('chai');
const chaiHttp = require('chai-http');
const {dbConnect, dbDisconnect} = require('../db-mongoose');
const {app, runServer, closeServer} = require('../server');
const {User} = require('../users/models');

const expect = chai.expect;

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);

describe('/api/user', function() {
	const username = 'exampleUser';
	const password = 'examplePass';
	const firstName = 'Example';
	const lastName = 'User';
	const questions = [];
	const current = 0;
	const	correct = 0;
	const incorrect = 0;
	const id = 0;

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
  
	after(function() {
		return closeServer();
	});

	beforeEach(function() {});

	afterEach(function() {
		return User.remove({});
	});

	describe('/api/users', function() {
		describe('POST', function() {
			it('Should reject users with missing username', function() {
				return chai
					.request(app)
					.post('/api/users')
					.send({
						password,
						firstName,
						lastName,
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing field');
						expect(res.body.location).to.equal('username');
					});
			});
			it('Should reject users with missing password', function() {
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						firstName,
						lastName,
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing field');
						expect(res.body.location).to.equal('password');
					});
			});
			it('Should reject users with non-string username', function() {
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username: 1234,
						password,
						firstName,
						lastName,
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Incorrect field type: expected string'
						);
						expect(res.body.location).to.equal('username');
					});
			});
			it('Should reject users with non-string password', function() {
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password: 1234,
						firstName,
						lastName,
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Incorrect field type: expected string'
						);
						expect(res.body.location).to.equal('password');
					});
			});
			it('Should reject users with non-trimmed username', function() {
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username: ` ${username} `,
						password,
						firstName,
						lastName,
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Cannot start or end with whitespace'
						);
						expect(res.body.location).to.equal('username');
					});
			});
			it('Should reject users with non-trimmed password', function() {
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password: ` ${password} `,
						firstName,
						lastName,
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Cannot start or end with whitespace'
						);
						expect(res.body.location).to.equal('password');
					});
			});
			it('Should reject users with empty username', function() {
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username: '',
						password,
						firstName,
						lastName,
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Must be at least 1 characters long'
						);
						expect(res.body.location).to.equal('username');
					});
			});
			it('Should reject users with password less than  eight characters', function() {
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password: '1234567',
						firstName,
						lastName,
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Must be at least 8 characters long'
						);
						expect(res.body.location).to.equal('password');
					});
			});
			it('Should reject users with password greater than 72 characters', function() {
				return chai
					.request(app)
					.post('/api/users')
					.send({
						username,
						password: new Array(74).fill('a').join(''),
						firstName,
						lastName,
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Must be at most 72 characters long'
						);
						expect(res.body.location).to.equal('password');
					});
			});
			it('Should reject users with duplicate username', function() {
				User.create({
					username,
					password,
					questions,
					current,
					correct,
					incorrect,
					id
				})
					.then(() => {
						// Try to create a second user with the same username
						return chai
							.request(app)
							.post('/api/users')
							.send({
								username,
								password,
								firstName,
								lastName,
							});
					})
					.then(() =>
						expect.fail(null, null, 'Request should not succeed')
					)
					.catch(err => {
						if (err instanceof chai.AssertionError) {
							throw err;
						}

						const res = err.response;
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Username already taken'
						);
						expect(res.body.location).to.equal('username');
					});
			});
		});
		it('Should create new user', function() {
			return chai
				.request(app)
				.post('/api/users')
				.send({
					username,
					password,
					firstName,
					lastName,
				})
				.then(res => {
					expect(res).to.have.status(201);
					expect(res.body).to.be.an('object');
					expect(res.body).to.have.keys(
						'username',
						'id',
						'current',
						'correct',
						'incorrect',
						'questions'
					);
					expect(res.body.username).to.equal(username);
					expect(res.body.current).to.equal(current);
					expect(res.body.correct).to.equal(correct);
					expect(res.body.incorrect).to.equal(incorrect);
					return User.findOne({
						username
					});
				})
				.then(user => {
					expect(user).to.not.be.null;
					expect(user.username).to.equal(username);
					return user.validatePassword(password);
				})
				.then(passwordIsCorrect => {
					expect(passwordIsCorrect).to.be.true;
				});
		});
	});
});


