'use strict';

module.exports = {
	PORT: process.env.PORT || 8080,
	CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://learning-asl-alphabet.netlify.com',
	DATABASE_URL:
        process.env.DATABASE_URL || 'mongodb+srv://palforrester@gmail.com:SandTrap64*@asl-questions.miz7i.mongodb.net/asl_questions?retryWrites=true&w=majority',
	TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL ||
        'http://localhost/asl-question-db-test',
	JWT_SECRET: 'tjandsam01', /*process.env.JWT_SECRET,*/
	JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};
