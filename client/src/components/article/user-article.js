import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import styled from 'styled-components';
import SwitchButton from 'react-switch-button';
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
    isToggled: false,
  }
  componentWillMount() {
    // Fetch user data prior to component mounting
    const user = cookie.load('user');
    this.props.fetchReadVotedArticles(user._id);
  }
  componentDidMount() {

  }
  openModal = (article) => {
    const { articles } = this.props;
    const { selectedArticle } = this.state;
    this.setState({ isModalOpen: true });
    let articleTemp = Object.assign({}, article);
    this.setState({ selectedArticle: articleTemp });
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
          <div> { selectedArticle.title } <br /></div>
          <div> { selectedArticle.pubdate } <br /></div>
          <div> { selectedArticle.summary } <br /></div>
          <div> { selectedArticle.description } <br /></div>
          <div> You voted as { selectedArticle.result === 1 ? "Factual":"Sensational" }<br /></div>
          
          <br />
          <SwitchButton
            name="switch-8"
            label="Switch mode"
            mode="select"
            labelRight="Factual"
            labelLeft="Sensationalized"
            onChange={this.handleSwitch}
          />
          <br />
          <br />
          <button onClick={this.OnVote}>Vote now </button>
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
