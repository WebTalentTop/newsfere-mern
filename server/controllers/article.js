//= =======================================
// Article Routes
//= =======================================
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
      let imageInfo;
      for (const attr in mediaInfo) {
        let mediaGroup = {};
        if (attr === 'media:content') {
          mediaGroup = mediaInfo[attr];
          const firstMedia = mediaGroup[0];
          imageInfo = firstMedia;
          for (const attr1 in firstMedia) {
            if (attr1 === '@') imageInfo = firstMedia[attr1].url;
          }
        }
      }
      
      const singleArticle = {
        title: item.title,
        link: item.link,
        pubdate: pubDate,
        image: imageInfo
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

