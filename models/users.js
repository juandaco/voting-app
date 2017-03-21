const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  username: String,
  githubID: String,
  name: String,
  // voted: Array,
  // polls: Array
});

module.exports = mongoose.model('User', User);
