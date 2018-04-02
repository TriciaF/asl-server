'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const {Question} = require('../questions/models');
const {User} = require('./models');

const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['username', 'password'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if (missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	const stringFields = ['username', 'password'];
	const nonStringField = stringFields.find(
		field => field in req.body && typeof req.body[field] !== 'string'
	);
	if (nonStringField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Incorrect field type: expected string',
			location: nonStringField
		});
	}

	const explicityTrimmedFields = ['username', 'password'];
	const nonTrimmedField = explicityTrimmedFields.find(
		field => req.body[field].trim() !== req.body[field]
	);

	if (nonTrimmedField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Cannot start or end with whitespace',
			location: nonTrimmedField
		});
	}

	const sizedFields = {
		username: {
			min: 1
		},
		password: {
			min: 8,
			// bcrypt truncates after 72 characters, so let's not give the illusion
			// of security by storing extra (unused) info
			max: 72
		}
	};
	const tooSmallField = Object.keys(sizedFields).find(
		field =>
			'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
	);
	const tooLargeField = Object.keys(sizedFields).find(
		field =>
			'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
	);

	if (tooSmallField || tooLargeField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: tooSmallField
				? `Must be at least ${sizedFields[tooSmallField]
					.min} characters long`
				: `Must be at most ${sizedFields[tooLargeField]
					.max} characters long`,
			location: tooSmallField || tooLargeField
		});
	}

	let {username, password} = req.body;

	return User.find({username})
		.count()
		.then(count => {
			if (count > 0) {
				return Promise.reject({
					code: 422,
					reason: 'ValidationError',
					message: 'Username already taken',
					location: 'username'
				});
			}
			return User.hashPassword(password);
		})
		.then(hash => {
			const list = [];

			Question
				.find()
				.then(questions => {
					for (let i=0; i<questions.length; i++) {
						list.push({
							image: questions[i].image,
							answer: questions[i].answer,
							mValue: 1,
							next: i+1 > questions.length - 1 ? null : i+1
						});
					}
					return list;
				})
				.then(list => {
					return User.create({
						username,
						password: hash,
						questions: list,
						current: 0,
						correct: 0,
						incorrect: 0
					});
				})
				.then(user => {
					return res.status(201).json(user.serialize());
				})
				.catch(err => {
					if (err.reason === 'ValidationError') {
						return res.status(err.code).json(err);
					}
					res.status(500).json({code: 500, message: 'Internal server error'});
				});
		});
});

// Fetch current question
router.get('/:id', (req, res) => {
	User
		.findById(req.params.id)
		.then(user => {
			console.log('user = ', user);
			res.json(user.questions[user.current]);
		})
		.catch(err => {
			console.error(err);
		});
});

// update mValue and traverse through list to insert current question
// m nodes back by updating next pointers accordingly
// then updating our user in db
// and then send next question
router.put('/:id', jsonParser, (req, res) => {
	User
		.findById(req.params.id)
		.then(result => {
			let current = result.questions[result.current];
			let currentIndex = result.current;
			let m;
			if (req.body.correct) {
				m = result.questions[currentIndex].mValue * 2;
				result.questions[currentIndex].mValue = m;
				result.correct++;
			} else {
				m = 1;
				result.questions[currentIndex].mValue = m;
				result.incorrect++;
			}
			result.current = current.next;

			for (let i=0; i<m; i++) {
				current = result.questions[current.next];
				if (current.next === null) {
					result.questions[currentIndex].next = null;
					current.next = currentIndex;
					return result;
				}
			}
			result.questions[currentIndex].next = current.next;
			current.next = currentIndex;  
			return result;
		})
		.then(result => {
			User
				.findByIdAndUpdate(req.params.id, {current: result.current, questions: result.questions, correct: result.correct, incorrect: result.incorrect}, {new: true})
				.then(updated => {
					res.status(200).json(updated.questions[updated.current]);
				})
				.catch(err => console.error(err));
		});
});

module.exports = {router};