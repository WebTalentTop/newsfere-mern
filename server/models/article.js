const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  _id: String,
  title: String,
  summary: String,
  descripton: String,
  pubdate: String,
  link: String,
  contentText: String,
  mediaImageURL: String,
  creditPercentage: { type: Number, defulat: 0 },
  totalNumberViews: { type: Number, defulat: 0 },
  totalNumberVotes: { type: Number, defulat: 0 },
  totalNumberSensationalVotes: { type: Number, defulat: 0 },
  totalNumberFactualVotes: { type: Number, defulat: 0 }
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Article', ArticleSchema);
