import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import styled from 'styled-components';
import Modal from '../template/modal';
import * as actions from '../../actions/article';

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
class UserArticle extends Component {
  state = {
    isModalOpen: false,
    selectedArticle: {},
  }
  componentWillMount() {
    // Fetch user data prior to component mounting
    const user = cookie.load('user');
    this.props.fetchReadVotedArticles(user._id);

  }
  openModal = (article) => {
  }
  closeModal = () => {
    this.setState({ isModalOpen: false });
  }
  
  render() {
    const { articles } = this.props;
    const { isModalOpen, selectedArticle, isToggled } = this.state;
    const articleList = articles.map((article, index) => {
      return (
          <div className="col-sm-4" onClick={()=> this.openModal(article)}>
            <ArticleItem >
              <div className='imgContainer'>
                <img src={article.mediaImageURL} />
              </div>
              <div className='articleInfo'>
                <div className='caption'>{article.title}</div>
                <div className='pubDate'>{article.pubdate}</div>
              </div>
              <div className='articleInfo'>
                <div className='viewer'>{article.totalNumberViews} Viewed</div>
                <div className='voted'>{article.totalNumberVotes} Voted</div>
              </div>
            </ArticleItem>
          </div>
      );
    });
    return (
      <div className="row">
        { articleList }
        <Modal isOpen={isModalOpen} closeModal={this.closeModal} heading="Voting">
          123
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    articles: state.article.userArticles,
    profile: state.user.profile,
  };
}

export default connect(mapStateToProps, actions)(UserArticle);
