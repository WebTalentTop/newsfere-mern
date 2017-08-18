import { FETCH_ARTICLES, ERROR_RESPONSE, FETCH_READ_VOTED_ARTICLES } from '../actions/types';

const INITIAL_STATE = { articles: [], userArticles: [], message: '', error: '' };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ARTICLES:
      return { ...state, articles: action.payload.articles };
    case FETCH_READ_VOTED_ARTICLES:
      return { ...state, userArticles: action.payload.articles };
    case ERROR_RESPONSE:
      return { ...state, error: action.payload };
  }

  return state;
}
