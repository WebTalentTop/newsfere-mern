const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const UserVoteDateSchema = new Schema({
  userID: { type: String, unique: true },
  articleID: { type: String, unique: true },
  votingResult: { type: Number, default: 0 },
  voteUpdateDate: Date
});

module.exports = mongoose.model('UserVoteDate', UserVoteDateSchema);
