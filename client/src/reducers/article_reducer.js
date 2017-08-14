import { FETCH_ARTICLES, ERROR_RESPONSE } from '../actions/types';

const INITIAL_STATE = { articles: [], message: '', error: '' };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ARTICLES:
      return { ...state, articles: action.payload.articles };
    case ERROR_RESPONSE:
      return { ...state, error: action.payload };
  }

  return state;
}
