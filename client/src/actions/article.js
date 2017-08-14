import { getData } from './index';
import { ARTICLE_ERROR, FETCH_ARTICLES } from './types';

export function fetchArticles() {
  const url = '/articles';
  return dispatch => getData(FETCH_ARTICLES, ARTICLE_ERROR, true, url, dispatch);
}
