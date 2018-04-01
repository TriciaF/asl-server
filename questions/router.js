'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const {Question} = require('./models');

const router = express.Router();
const jsonParser = bodyParser.json();

router.get('/', (req, res) => {
	Question.find()
		.then(questions => res.json(questions.map(question => question.serialize())))
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.get('/:id', (req, res) => {
	Question
		.findById(req.params.id)
		.then(result => {
			res.json(result.serialize());
		})
		.catch(error => {
			console.error(error);
		});
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['image', 'answer', 'mValue'];
	const missingField = requiredFields.find(field => !(field in req.body));

	if (missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	Question
		.create({
			image: req.body.image,
			answer: req.body.answer,
			mValue: req.body.mValue
		})
		.then(question =>
			res.status(201).json(question.serialize()))
		.catch(err=>console.error(err));
}); 

module.exports = {router};