'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
	image: {
		type: String,
		required: true
	},
	answer: {
		type: String,
		required: true
	}
});

QuestionSchema.methods.serialize = function() {
	return {
		id: this._id,
		image: this.image,
		answer: this.answer,
		mValue: this.mValue
	};
};

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};