const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollOptions = new Schema({
  name: String,
  votes: Number
}, { _id: false });

const Poll = new Schema({
  title: String,
  options: [pollOptions]
});

module.exports = mongoose.model('Poll', Poll);
