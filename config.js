'use strict';

module.exports = {
	PORT: process.env.PORT || 8080,
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://asl-learning.netlify.com',
	DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb://TriciaF:tjandsam01@ds229549.mlab.com:29549/asl_questions',
	TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'mongodb://localhost:27017/asl-questions-test-database',
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};
