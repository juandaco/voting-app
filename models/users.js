const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  oauthService: String,
  oauthServiceID: Number,
  name: String,
  polls: {
    type: Array,
    default: []
  }
}, {
  versionKey: false,
});

module.exports = mongoose.model('User', User);
