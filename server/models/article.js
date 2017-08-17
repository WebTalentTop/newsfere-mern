const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  _id: String,
  title: String,
  descripton: String,
  summary: String,
  pubdate: String,
  link: String,
  contentText: String,
  mediaImageURL: String,
  totalNumberViews: Number,
  totalNumberSensationalVotes: Number,
  totalNumberFactualVotes: Number
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Article', ArticleSchema);
