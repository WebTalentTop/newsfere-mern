import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import SwitchButton from 'react-switch-button';
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
class ArticleList extends Component {
  state = {
    isModalOpen: false,
    selectedArticle: {},
    isToggled: false,
  }
  componentWillMount() {
    // Fetch user data prior to component mounting
    this.props.fetchArticles();
  }
  openModal = (article) => {
    this.setState({ isModalOpen: true });
    let articleTemp = Object.assign({}, this.state.selectedArticle);
    articleTemp = article;
    this.setState({ selectedArticle: articleTemp });
  }
  closeModal = () => {
    this.setState({ isModalOpen: false });
  }
  helperEncoding = (str) => {
    const Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", encode: function(e) {var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    const encodedString = Base64.encode(str);
    return encodedString;
  }
  handleSwitch = () => {
    this.setState({ isToggled: !this.state.isToggled });
  }
  OnVote = () => {
    const { selectedArticle, isToggled } = this.state;
    const user = cookie.load('user'); 
    const votedArticle = {
      profile: user,
      _id: this.helperEncoding(selectedArticle.title),
      title: selectedArticle.title,
      pubdate: selectedArticle.pubdate,
      mediaImageURL: selectedArticle.mediaImageURL,
      link: selectedArticle.link,
      voted: isToggled
    }
    this.props.voteArticle(votedArticle);
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
            </ArticleItem>
          </div>
      );
    });
    return (
      <div className="row">
        { articleList }
        <Modal isOpen={isModalOpen} closeModal={this.closeModal} heading="Voting">
          <div> { selectedArticle.title } </div>
          <br />
          <div> { selectedArticle.pubdate } </div>
          <br />
          <SwitchButton 
            name="switch-8"
            label="Switch mode"
            mode="select"
            labelRight="Factual"
            label="Sensationalized"
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
    articles: state.article.articles,
    profile: state.user.profile,
  };
}

export default connect(mapStateToProps, actions)(ArticleList);
