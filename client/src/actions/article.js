import { getData, putData } from './index';
import { ARTICLE_ERROR, VOTE_ARTICLE, FETCH_ARTICLES, ARTICLE_VIEWED, FETCH_READ_VOTED_ARTICLES } from './types';

export function fetchArticles() {
  const url = '/articles';
  return dispatch => getData(FETCH_ARTICLES, ARTICLE_ERROR, true, url, dispatch);
}
export function voteArticle(data) {
  const url = '/articles/vote';
  return dispatch => putData(VOTE_ARTICLE, ARTICLE_ERROR, true, url, dispatch, data);
}
export function viewArticle(data) {
  const url = '/articles/view';
  return dispatch => putData(ARTICLE_VIEWED, ARTICLE_ERROR, true, url, dispatch, data);
}
export function fetchReadVotedArticles(uid) {
  const url = `/articles/read-voted/${uid}`;
  return dispatch => getData(FETCH_READ_VOTED_ARTICLES, ARTICLE_ERROR, true, url, dispatch);
}