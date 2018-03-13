const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Question'
  }],
  next: {
    type: Number,
    default: null
  },
  correct: {
    type: Number,
    default: 0
  },
  incorrect: {
    type: Number,
    default: 0
  }
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username,
    questions: this.questions,
    next: this.next,
    correct: this.correct,
    incorrect: this.incorrect
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};