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

module.exports = {router};