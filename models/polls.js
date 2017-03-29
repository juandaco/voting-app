const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pollOptions = new Schema(
  {
    name: String,
    votes: Number
  },
  {
    _id: false,
    versionKey: false
  }
);

const Poll = new Schema(
  {
    title: String,
    options: [pollOptions],
    createdBy: String,
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Poll', Poll);
