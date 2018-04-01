'use strict';

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');

const { router: usersRouter } = require('./users');
const { router: questionsRouter } = require('./questions');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');

mongoose.Promise = global.Promise;
const app = express();

app.use(morgan('common'));

// app.use(
// 	morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
// 		skip: (req, res) => process.env.NODE_ENV === 'test'
// 	})
// );

//Turn this section 'on' if doing local development
// app.use(
// 	cors({
// 		origin: CLIENT_ORIGIN
// 	})
// );
// ifor CORS
app.use(function(req, res, next) 
{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
	if (req.method === 'OPTIONS') {
		return res.send(204);
	}
	next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/questions/', questionsRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.get('/api/protected', jwtAuth, (req, res) => {
	res.json({
		data: 'authorized'
	});
});


app.get('/', (req, res) => {
	res.json({message: 'hello world'});
});

app.use('*', (req, res) => {
	return res.status(404).json({ message: 'Not Found' });
});

function runServer(port = PORT) {
	const server = app
		.listen(port, () => {
			console.info(`App listening on port ${server.address().port}`);
		})
		.on('error', err => {
			console.error('Express failed to start');
			console.error(err);
		});
}
function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Closing server');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	dbConnect();
	runServer();
}

module.exports = {app, runServer, closeServer};
