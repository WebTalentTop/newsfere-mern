import { FETCH_ARTICLES, ERROR_RESPONSE, FETCH_READ_VOTED_ARTICLES, VOTE_ARTICLE, VOTE_CHART } from '../actions/types';

const INITIAL_STATE = { articles: [], userArticles: [], message: '', error: '' };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_ARTICLES:
      return { ...state, articles: action.payload.articles };
    case FETCH_READ_VOTED_ARTICLES:
      return { ...state, userArticles: action.payload.articles };
    case ERROR_RESPONSE:
      return { ...state, error: action.payload };
    case VOTE_CHART:
      return { ...state, chartInfo: action.payload.chartInfo };
    case VOTE_ARTICLE:
      if (action.payload.updateFlag) {
        return { ...state, userArticles: state.userArticles.map(articleToUpdate => {
            return articleToUpdate._id === action.payload.updatedArticle._id ?
            action.payload.updatedArticle : articleToUpdate 
          })
        };
      } else {
        return { ...state, userArticles: { ...state.userArticles, ...action.payload.updatedArticle } };
      }
  }
  return state;
}
