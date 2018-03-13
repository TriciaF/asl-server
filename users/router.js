const express = require('express');
const bodyParser = require('body-parser');

const {User} = require('./models');
const {Question} = require('../questions/models');


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
      function shuffle(array) {
        let j = 0, temp = null;
        for (let i=array.length-1; i > 0; i-=1) {
          j = Math.floor(Math.random() * (i + 1));
          temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
      }
      const questionList = [
        {_id: '5aa7e931734d1d6b712047a2'},
        {_id: '5aa7e945734d1d6b712047ab'},
        {_id: '5aa7e953734d1d6b712047ad'},
        {_id: '5aa7e95b734d1d6b712047af'},
        {_id: '5aa7e965734d1d6b712047b1'},
        {_id: '5aa7e96d734d1d6b712047b5'},
        {_id: '5aa7e97a734d1d6b712047b8'},
        {_id: '5aa7e982734d1d6b712047b9'},
        {_id: '5aa7e98b734d1d6b712047bd'},
        {_id: '5aa7e992734d1d6b712047be'}
      ];
      const randomizedList = shuffle(questionList);
      console.log(randomizedList);
      return User.create({
        username,
        password: hash,
        questions: randomizedList
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

// Should remove later since I don't want anyone to have access to all users
router.get('/', (req, res) => {
  User.find()
    .populate('questions')
    .then(users => {
      res.json(users.map(user => user.serialize()));
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.get('/:id', (req, res) => {
  User
    .findById(req.params.id)
    .populate('questions')
    .then(user => {
      res.json(user.serialize());
    })
    .catch(err => {
      console.error(err);
    });
});

module.exports = {router};