import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/article';
import styled from 'styled-components';

const ArticleItem = styled.div`{
  border-radius: 6px;
  padding: 10px;
  &:hover {
    background: rgb(222,222,222);
    transition: background .2s ease;
    & > .imgContainer img {
      opacity: .7;
      transition: opacity .2s linear;
    }
  }
  & > .imgContainer img {
    width: 100%;
    border-radius: 6px;
    opacity: 1;
  }
  & > .articleInfo {
    display: flex;
    padding: 5px;
    justify-content: space-between;
    & > .caption {
      color: #444;
      font-weight: bold;
      padding-right: 10px
    }
    & > .pubDate {
      color: #888;
      font-size: 12px;
    }
  }
}
`;
class ArticleList extends Component {
  componentWillMount() {
    // Fetch user data prior to component mounting
     this.props.fetchArticles();
  }

  render() {
    const { articles } = this.props;
    const articleList = articles.map((article, index) => {
      return (
          <div className="col-sm-4">
            <ArticleItem>
              <div className='imgContainer'>
                <a href={article.link} target='_blank'>
                  <img src={article.image} />
                </a>
              </div>
              <div className='articleInfo'>
                <div className='caption'>{article.title}</div>
                <div className='pubDate'>{article.pubdate}</div>
              </div>
            </ArticleItem>
          </div>
      );
    });
    return (
      <div className="row">{ articleList }</div>
    );
  }
}

function mapStateToProps(state) {
  return {
    articles: state.article.articles,
  };
}

export default connect(mapStateToProps, actions)(ArticleList);
