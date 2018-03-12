const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const QuestionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  position: 1,
  next: null
});

// QuestionSchema.methods.serialize = function() {
//   return {
//     id: this._id,
//     question: this.question,
//     answer: this.answe
//   };
// };

const Question = mongoose.model('Question', QuestionSchema);

module.exports = {Question};
module.exports = QuestionSchema;