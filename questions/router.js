const express = require('express');
const bodyParser = require('body-parser');

const {Question} = require('./models');

const router = express.Router();
const jsonParser = bodyParser.json();