const mongoose = require('mongoose'),
  Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  _id: String,
  title: String,
  descripton: String,
  summary: String,
  date: String,
  pubdate: String,
  pubDate: String,
  link: String,
  permalink: String,
  articleContent: String,
  mediagroup: {
    proto: String,
    mediacontent: {
      1: {
          proto: {
            medium: String,
            url: String,
            height: String,
            width: String
          }
        }
      }
  },
  numberViews: Number,
  numberVotedSensational: Number,
  numberVotedFactual: Number
},
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  });

module.exports = mongoose.model('Article', ArticleSchema);
