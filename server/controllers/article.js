//= =======================================
// Article Routes
//= =======================================
const Article = require('../models/article');
const User = require('../models/user');
const ArticleCounter = require('../models/articleCounter');
const setArticleInfo = require('../helpers').setArticleInfo;

exports.getArticles = function (req1, res1, next) {

  var FeedParser = require('feedparser');
  var request = require('request'); // for fetching the feed
  
  var req = request('http://rss.cnn.com/rss/edition.rss')
  var feedparser = new FeedParser([]);
  var articlesToReturn = [];
  var count = 0;
  req.on('error', function (error) {
    // handle any request errors
  });

  req.on('response', function (res) {
    var stream = this; // `this` is `req`, which is a stream

    if (res.statusCode !== 200) {
      this.emit('error', new Error('Bad status code'));
    }
    else {
      stream.pipe(feedparser);
    }
  });

  feedparser.on('error', function (error) {
    // always handle errors
  });

  // image: item['media:group']['media:content'][0]['@']['url']
  feedparser.on('readable', function () {
    // This is where the action is!
    const stream = this; // `this` is `feedparser`, which is a stream
    let item = stream.read();
    while (item) {
      const pubInfo = item['rss:pubdate'];
      let pubDate;
      for (const attr in pubInfo) { 
        if (attr === '#') pubDate = pubInfo[attr]
      }

      const mediaInfo = item['media:group'];
      let mediaImageURL;
      for (const attr in mediaInfo) {
        let mediaGroup = {};
        if (attr === 'media:content') {
          mediaGroup = mediaInfo[attr];
          const firstMedia = mediaGroup[0];
          mediaImageURL = firstMedia;
          for (const attr1 in firstMedia) {
            if (attr1 === '@') mediaImageURL = firstMedia[attr1].url;
          }
        }
      }
      
      const singleArticle = {
        title: item.title,
        link: item.link,
        pubdate: pubDate,
        mediaImageURL: mediaImageURL
      };
      articlesToReturn.push(singleArticle);
      count++;
      item = stream.read();
    }
    if (count === 40) {
      return res1.status(200).json({ articles: articlesToReturn }); 
    }
  });
};
exports.voteArticle = function (req, res, next) {
  const article = req.body;
  const user = article.profile;
  // Article Couter Store
  ArticleCounter.findOne({ articleID: article._id }, (err, foundArticleCounter) => {
    let articleCounterToSave = {};
    let usersRead = [];
    let usersVotedSensational = [];
    let usersVotedFactual = [];
    if (foundArticleCounter !== null) {
      // The article viewed or voted at least once exists
      const posUserRead = foundArticleCounter.usersRead.indexOf(user._id);
      const posUserSensational = foundArticleCounter.usersVotedSensational.indexOf(user._id);
      const posUserFactual = foundArticleCounter.usersVotedFactual.indexOf(user._id);
      usersRead = foundArticleCounter.usersRead;
      usersVotedSensational = foundArticleCounter.usersVotedSensational;
      usersVotedFactual = foundArticleCounter.usersVotedFactual;
      if (posUserRead < 0) usersRead.push(user._id);
      if (posUserSensational < 0 && article.voted === false) {
        usersVotedSensational.push(user._id);
      } else if (posUserSensational >= 0 && article.voted === true) {
        usersVotedSensational.splice(posUserSensational);
      }
      if (posUserFactual < 0 && article.voted === true) {
        usersVotedFactual.push(user._id);
      } else if (posUserFactual >= 0 && article.voted === false) {
        usersVotedFactual.splice(posUserFactual);
      }
      articleCounterToSave = foundArticleCounter;
    } else {
      // The article never viewed or voted
      articleCounterToSave.articleID = article._id;
      usersRead.push(user._id);
      if (article.voted === true) usersVotedFactual.push(user._id);
      else usersVotedSensational.push(user._id);
    }
    articleCounterToSave.usersRead = usersRead;
    articleCounterToSave.usersVotedSensational = usersVotedSensational;
    articleCounterToSave.usersVotedFactual = usersVotedFactual;
    articleCounterToSave.totalNumberViews = usersRead.length;
    articleCounterToSave.totalNumberSensationalVotes = usersVotedSensational.length;
    articleCounterToSave.totalNumberFactualVotes = usersVotedFactual.length;
    articleCounterToSave.totalNumberVotes =
    parseInt(usersVotedFactual.length + usersVotedSensational.length, 10);
    console.log(articleCounterToSave);
    ArticleCounter.update({ articleID: article._id }, articleCounterToSave, { upsert: true },
      (error, found) => {
      });
  });

  User.findById(user._id, (err, foundUser) => {
    let userInfo = {};
    if (foundUser !== null) {
      userInfo = foundUser;
      if (userInfo.articlesRead.indexOf(article._id) < 0) {
        userInfo.articlesRead.push(article._id);
      }
      if (userInfo.articlesVoted.indexOf(article._id) < 0) {
        userInfo.articlesVoted.push(article._id);
        if (article.voted === true) userInfo.totalNumberFactualVotes += 1;
        else userInfo.totalNumberSensationalVotes += 1;
      }
      userInfo.totalNumberViews = userInfo.articlesRead.length;
      userInfo.totalNumberVotes = userInfo.articlesVoted.length;
    }
    console.log(userInfo);
    User.update({ _id: user._id }, userInfo, { upsert: true }, (error, found) => {
      res.status(201).json({
        user: userInfo
      });
    });
  });

  Article.findById(article._id, (err, foundArticle) => {
    const articleToSave = setArticleInfo(article);
    Article.update({ _id: article._id }, articleToSave, { upsert: true }, (error, found) => {
      // res.status(201).json({
      //   article: articleToSave
      // });
    });
  });
};


