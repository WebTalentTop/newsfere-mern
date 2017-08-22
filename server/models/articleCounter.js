const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ArticleCounterSchema = new Schema({
  _id: String,
  articleID: String,
  usersRead: { type: Array, default: [] },
  usersVotedSensational: { type: Array, default: [] },
  usersVotedFactual: { type: Array, default: [] }
});

module.exports = mongoose.model('ArticleCounter', ArticleCounterSchema);
