const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ArticleCounterSchema = new Schema({
  _id: String,
  articleID: String,
  usersRead: [],
  usersVotedSensational: [],
  usersVotedFactual: [],
  totalNumberViews: Number,
  totalNumberVotes: Number,
  totalNumberSensationalVotes: Number,
  totalNumberFactualVotes: Number
});

module.exports = mongoose.model('ArticleCounter', ArticleCounterSchema);
