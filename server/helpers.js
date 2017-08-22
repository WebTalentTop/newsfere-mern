const ROLE_MEMBER = require('./constants').ROLE_MEMBER;
const ROLE_CLIENT = require('./constants').ROLE_CLIENT;
const ROLE_OWNER = require('./constants').ROLE_OWNER;
const ROLE_ADMIN = require('./constants').ROLE_ADMIN;

// Set user info from request
exports.setUserInfo = function setUserInfo(request) {
  const getUserInfo = {
    _id: request._id,
    firstName: request.profile.firstName,
    lastName: request.profile.lastName,
    email: request.email,
    role: request.role
  };

  return getUserInfo;
};
exports.setArticleInfo = function setArticleInfo(request) {
  const getArticleInfo = {
    _id: request._id,
    title: request.title,
    summary: request.summary,
    description: request.description,
    pubdate: request.pubdate,
    link: request.link,
    mediaImageURL: request.mediaImageURL,
    votingResult: request.voted,
    creditPercentage: request.creditPercentage,
    totalNumberViews: request.totalNumberViews,
    totalNumberVotes: request.totalNumberVotes,
    totalNumberSensationalVotes: request.totalNumberSensationalVotes,
    totalNumberFactualVotes: request.totalNumberFactualVotes
  };

  return getArticleInfo;
}

exports.getRole = function getRole(checkRole) {
  let role;

  switch (checkRole) {
    case ROLE_ADMIN: role = 4; break;
    case ROLE_OWNER: role = 3; break;
    case ROLE_CLIENT: role = 2; break;
    case ROLE_MEMBER: role = 1; break;
    default: role = 1;
  }

  return role;
};
