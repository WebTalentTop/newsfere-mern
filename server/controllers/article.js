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
    console.log(item.description);
    while (item) {
      const pubInfo = item['rss:pubdate'];
      let pubDate;
      for (const attr in pubInfo) { 
        if (attr === '#') pubDate = pubInfo[attr]
      }

      const mediaInfo = item['media:group'];
      let imgURL;
      for (const attr in mediaInfo) {
        let mediaGroup = {};
        if (attr === 'media:content') {
          mediaGroup = mediaInfo[attr];
          const firstMedia = mediaGroup[0];
          imgURL = firstMedia;
          for (const attr1 in firstMedia) {
            if (attr1 === '@') imgURL = firstMedia[attr1].url;
          }
        }
      }
      const singleArticle = {
        title: item.title,
        summary: item.summary,
        description: item.description,
        link: item.link,
        pubdate: pubDate,
        mediaImageURL: imgURL
      };
      articlesToReturn.push(singleArticle);
      count++;
      item = stream.read();
    }
    if (count === 40) {
      console.log(articlesToReturn);
      return res1.status(200).json({ articles: articlesToReturn }); 
    }
  });
};
exports.voteArticle = function (req, res, next) {
  const article = req.body;
  const user = article.profile;
  let articleCounterToSave = {};
  let usersRead = [];
  let usersVotedSensational = [];
  let usersVotedFactual = [];
  // Article Couter Store
  ArticleCounter.findOne({ articleID: article._id }, (err, foundArticleCounter) => {

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

    ArticleCounter.update({ articleID: article._id }, articleCounterToSave, { upsert: true },
      (error, found) => {
      });
    Article.findById(article._id, (err, foundArticle) => {
      const articleToSave = setArticleInfo(article);
      articleToSave.totalNumberViews = usersRead.length;
      articleToSave.totalNumberSensationalVotes = usersVotedSensational.length;
      articleToSave.totalNumberFactualVotes = usersVotedFactual.length;
      articleToSave.totalNumberVotes =
      parseInt(usersVotedFactual.length + usersVotedSensational.length, 10);
      Article.update({ _id: article._id }, articleToSave, { upsert: true }, (error, found) => {
      });
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
        if (article.voted === true) {
          userInfo.totalNumberFactualVotes += 1;
          userInfo.articlesVotedFactual.push(article._id);
        } else {
          userInfo.totalNumberSensationalVotes += 1;
          userInfo.articlesVotedSensational.push(article._id);
        }
      }
      userInfo.totalNumberViews = userInfo.articlesRead.length;
      userInfo.totalNumberVotes = userInfo.articlesVoted.length;
    }
    User.update({ _id: user._id }, userInfo, { upsert: true }, (error, found) => {
    });
  });
};
exports.getReadVoted = function (req, res, next) {
  const userID = req.params.userID;
  const articlesToReturn = [];
  User.findById(userID, (err, foundUser) => {
    if (foundUser) {
      if (foundUser.articlesRead) {
        let readCount = 0;
        foundUser.articlesRead.forEach((singleArticleID) => {
          Article.findById(singleArticleID, (err, foundArticle) => {
            let singleArticle = foundArticle;
            singleArticle.result = 0;
            readCount += 1;
            if (foundUser.articlesVotedFactual.indexOf(singleArticleID) > 0)
              singleArticle.result = 1;
            else singleArticle.result = -1;
            singleArticle = setArticleInfo(singleArticle);
            articlesToReturn.push(singleArticle);
            if (readCount === foundUser.articlesRead.length) {
              return res.status(200).json({ articles: articlesToReturn });
            }
          });
        });
      }
    }
  });
}

