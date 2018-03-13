const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {Question} = require('../questions/models');

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
  // session: [{
  //   image: {
  //     type: String,
  //     required: true
  //   },
  //   answer: {
  //     type: String,
  //     required: true
  //   },
  //   position: {
  //     type: Number,
  //     default: 1
  //   },
  //   next: {
  //     type: Number
  //   }
  // }]
  session: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Question',
    next: {
      type: Number,
      default: 1
    },
    correct: {
      type: Number,
      default: 0
    },
    incorrect: {
      type: Number,
      default: 0
    }
  }]
});

UserSchema.methods.serialize = function() {
  return {
    id: this._id,
    username: this.username || '',
    session: this.session
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