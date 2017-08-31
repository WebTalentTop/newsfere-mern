const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserVoteDateSchema = new Schema({
  userID: { type: String, unique: true },
  articleList: [],
  votedDateList: [],
  votingResultList: []
});

module.exports = mongoose.model('UserVoteDate', UserVoteDateSchema);
