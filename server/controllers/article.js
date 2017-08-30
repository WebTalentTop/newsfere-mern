//= =======================================
// Article Routes
//= =======================================
const Article = require('../models/article');
const User = require('../models/user');
const ArticleCounter = require('../models/articleCounter');
const UserVoteDate = require('../models/userVoteDate');
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
      return res1.status(200).json({ articles: articlesToReturn }); 
    }
  });
};
exports.viewArticle = function (req, res, next) {
  const article = req.body;
  const user = article.profile;
  let articleCounterToSave = {};
  let articleToSave = {};
  let usersRead = [];
  let usersVotedSensational = [];
  let usersVotedFactual = [];
  let creditPercentage = 0;
  ArticleCounter.findOne({ articleID: article._id }, (err, foundArticleCounter) => {
    if (foundArticleCounter !== null) {
      usersRead = foundArticleCounter.usersRead;
      usersVotedSensational = foundArticleCounter.usersVotedSensational;
      usersVotedFactual = foundArticleCounter.usersVotedFactual;
      const posUserRead = usersRead.indexOf(user._id);
      if (posUserRead < 0) usersRead.push(user._id);
      articleCounterToSave = foundArticleCounter;
    } else {
      articleCounterToSave.articleID = article._id;
      usersRead.push(user._id);
    }
    articleCounterToSave.usersRead = usersRead;
    articleCounterToSave.usersVotedSensational = usersVotedSensational;
    articleCounterToSave.usersVotedFactual = usersVotedFactual;
    ArticleCounter.update({ articleID: article._id }, articleCounterToSave, { upsert: true },
      (error, found) => {
      });
    Article.findById(article._id, (err, foundArticle) => {
      articleToSave = setArticleInfo(article);
      articleToSave.totalNumberViews = usersRead.length;
      articleToSave.totalNumberSensationalVotes = usersVotedSensational.length;
      articleToSave.totalNumberFactualVotes = usersVotedFactual.length;
      articleToSave.totalNumberVotes = usersVotedSensational.length + usersVotedFactual.length;
      if (articleToSave.totalNumberVotes > 0) {
        creditPercentage = (usersVotedFactual.length / articleToSave.totalNumberVotes) * 100;
      }
      articleToSave.creditPercentage = creditPercentage;
      Article.update({ _id: article._id }, articleToSave, { upsert: true }, (error, found) => {
      });
      // const userDateToSave = {};
      // userDateToSave.firstViewDate = Date.now;
      // UserVoteDate.update({ userID: user._id, articleID: article._id }, userDateToSave, { upsert: true }, (error, found) => {
      // });
      User.findById(user._id, (err, foundUser) => {
        let userInfo = {};
        if (foundUser !== null) {
          userInfo = foundUser;
          // Push Article if it doesn't exist
          if (userInfo.articlesRead.indexOf(article._id) < 0) {
            userInfo.articlesRead.push(article._id);
          }
          userInfo.totalNumberViews = userInfo.articlesRead.length;
          User.update({ _id: user._id }, userInfo, { upsert: true }, (error, found) => {
          });
        }
      });
    });
  });
};
exports.voteArticle = function (req, res, next) {
  const article = req.body;
  const user = article.profile;
  let articleCounterToSave = {};
  let articleToSave = {};
  let isUpdate = 1;
  let usersRead = [];
  let usersVotedSensational = [];
  let usersVotedFactual = [];
  let creditPercentage = 0;
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
      if (posUserSensational < 0 && article.voted < 0) {
        usersVotedSensational.push(user._id);
      } else if (posUserSensational >= 0 && article.voted > 0) {
        usersVotedSensational.splice(posUserSensational);
      }
      if (posUserFactual < 0 && article.voted > 0) {
        usersVotedFactual.push(user._id);
      } else if (posUserFactual >= 0 && article.voted < 0) {
        usersVotedFactual.splice(posUserFactual);
      }
      articleCounterToSave = foundArticleCounter;
    } else {
      // The article never viewed or voted
      articleCounterToSave.articleID = article._id;
      usersRead.push(user._id);
      if (article.voted > 0) usersVotedFactual.push(user._id);
      else usersVotedSensational.push(user._id);
    }
    articleCounterToSave.usersRead = usersRead;
    articleCounterToSave.usersVotedSensational = usersVotedSensational;
    articleCounterToSave.usersVotedFactual = usersVotedFactual;
    ArticleCounter.update({ articleID: article._id }, articleCounterToSave, { upsert: true },
      (error, found) => {
      });
    Article.findById(article._id, (err, foundArticle) => {
      articleToSave = setArticleInfo(article);
      articleToSave.totalNumberViews = usersRead.length;
      articleToSave.totalNumberSensationalVotes = usersVotedSensational.length;
      articleToSave.totalNumberFactualVotes = usersVotedFactual.length;
      articleToSave.totalNumberVotes = usersVotedSensational.length + usersVotedFactual.length;
      if (articleToSave.totalNumberVotes > 0) {
        creditPercentage = (usersVotedFactual.length / articleToSave.totalNumberVotes) * 100;
      }
      articleToSave.creditPercentage = creditPercentage;
      Article.update({ _id: article._id }, articleToSave, { upsert: true }, (error, found) => {
      });
      let articleList = [];
      let votedDateList = [];
      let votingResultList = [];
      UserVoteDate.findOne({ userID: user._id }, (err, foundInfo) => {
        if (foundInfo !== null) {
          articleList = foundInfo.articleList;
          votedDateList = foundInfo.votedDateList;
          votingResultList = foundInfo.votingResultList;
          const articlePos = articleList.indexOf(article._id)
          if (articlePos < 0) {
            articleList.push(article._id);
            votedDateList.push(new Date());
            votingResultList.push(articleToSave.votingResult);
          } else {
            votedDateList[articlePos] = new Date();
            votingResultList[articlePos] = articleToSave.votingResult;
          }
        } else {
            articleList.push(article._id);
            votedDateList.push(new Date());
            votingResultList.push(articleToSave.votingResult);
        }
        const userVoteDateToSave = {};
        userVoteDateToSave.userID = user._id;
        userVoteDateToSave.articleList = articleList;
        userVoteDateToSave.votedDateList = votedDateList;
        userVoteDateToSave.votingResultList = votingResultList;
        UserVoteDate.update({
          userID: user._id },
          userVoteDateToSave, { upsert: true },
          (error, found) => {
            console.log(found);
        });
      });
      User.findById(user._id, (err, foundUser) => {
        let userInfo = {};
        if (foundUser !== null) {
          userInfo = foundUser;
          // Push Article if it doesn't exist
          if (userInfo.articlesRead.indexOf(article._id) < 0) {
            isUpdate = 0;
            userInfo.articlesRead.push(article._id);
          }
          // If it's newly voted
          if (userInfo.articlesVoted.indexOf(article._id) < 0) {
            if (article.voted > 0) {
              userInfo.articlesVotedFactual.push(article._id);
            } else {
              userInfo.articlesVotedSensational.push(article._id);
            }
          } else { // If it's for updaing voting Result
            const posUserSensational = userInfo.articlesVotedSensational.indexOf(article._id);
            const posUserFactual = userInfo.articlesVotedFactual.indexOf(article._id);
            if (article.voted > 0) {
              if (posUserSensational >= 0) {
                userInfo.articlesVotedSensational.splice(posUserSensational);
                userInfo.articlesVotedFactual.push(article._id);
              } else if (posUserFactual < 0) {
                userInfo.articlesVotedFactual.push(article._id);
              }
            }
            if (article.voted < 0) {
              if (posUserFactual >= 0) {
                userInfo.articlesVotedFactual.splice(posUserFactual);
                userInfo.articlesVotedSensational.push(article._id);
              } else if (posUserSensational < 0) {
                userInfo.articlesVotedSensational.push(article._id);
              }
            }
          }
          userInfo.articlesVoted = userInfo.articlesVotedFactual.concat(userInfo.articlesVotedSensational);
          userInfo.totalNumberViews = userInfo.articlesRead.length;
          userInfo.totalNumberSensationalVotes = userInfo.articlesVotedSensational.length;
          userInfo.totalNumberFactualVotes = userInfo.articlesVotedFactual.length;
          userInfo.totalNumberVotes = userInfo.totalNumberSensationalVotes + userInfo.totalNumberFactualVotes;
          User.update({ _id: user._id }, userInfo, { upsert: true }, (error, found) => {
            return res.status(200).json({ updatedArticle: articleToSave, updateFlag: isUpdate });
          });
        }
      });
    });
  });
};
exports.getReadVoted = function (req, res, next) {
  const userID = req.params.userID;
  const articlesToReturn = [];
  User.findById(userID, (err, foundUser) => {
    if (foundUser !== null) {
      if (foundUser.articlesRead) {
        let readCount = 0;
        foundUser.articlesRead.forEach((singleArticleID) => {
          Article.findById(singleArticleID, (err, foundArticle) => {
            readCount += 1;
            if (foundArticle !== null) {
              let singleArticle = foundArticle;
              singleArticle.voted = 0;
              if (foundUser.articlesVotedFactual.indexOf(singleArticleID) > 0) {
                singleArticle.voted = 1;
              } else if (foundUser.articlesVotedSensational.indexOf(singleArticleID) > 0) {
                singleArticle.voted = -1;
              }
              singleArticle = setArticleInfo(singleArticle);
              articlesToReturn.push(singleArticle);
            }
            if (readCount === foundUser.articlesRead.length) {
              return res.status(200).json({ articles: articlesToReturn });
            }
          });
        });
      }
    }
  });
};
exports.getVoteTimeChartInfo = function (req, res, next) {
  const user_id = req.params.userID;
  const ChartInfoToReturn = {};
  const allDates = [];
  const totalVotes = [];
  const factualVotes = [];
  const sensationalVotes = [];
  
  UserVoteDate.findOne({ userID: user_id }, (err, foundUserDateInfo) => {
    if (foundUserDateInfo !== null) {
      foundUserDateInfo.votedDateList.forEach(function(singleVote, index) {
        const currentDate = singleVote.toISOString().substring(0, 10);
        const arrPos = allDates.indexOf(currentDate);
        if (arrPos < 0) {
          allDates.push(currentDate);
          totalVotes.push(1);
          if (foundUserDateInfo.votingResultList[index] > 0) {
            factualVotes.push(1);
            sensationalVotes.push(0);
          } else {
            sensationalVotes.push(1);
            factualVotes.push(0);
          }
        } else {
          totalVotes[arrPos] += 1;
          if (foundUserDateInfo.votingResultList[index] > 0) {
            factualVotes[arrPos] += 1;
          } else {
            sensationalVotes[arrPos] += 1;
          }
        }
      });
      ChartInfoToReturn.dateInfo = allDates;
      ChartInfoToReturn.voteInfo = totalVotes;
      ChartInfoToReturn.voteFactual = factualVotes;
      ChartInfoToReturn.voteSensational = sensationalVotes;
      return res.status(200).json({ chartInfo: ChartInfoToReturn });
    }
  });
};

