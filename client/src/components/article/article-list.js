import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import styled from 'styled-components';
import Slider from 'react-slick';
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
    color: #888;
    justify-content: space-between;
    & > div > .super-crazy-colors {
      color: #888;
      font-size: 13px;
      textShadow: 0 1px 0 rgba(0, 0, 0, 0.1);
      margin-right: 7px;
    }
  }
  & > .articleCaption {
    padding: 5px;
    & > .caption {
      color: #444;
      font-weight: bold;
      padding-right: 10px
    }
    & > .pubDate {
      color: #b5b5b5;
      padding-top: 2px;
      font-size: 11px;
    }
  }
}
`;
const SwiperContainer = styled.div`{
    width: 410px;
    text-align: center;
    color: white;
  }
`;
const BoardSlider = styled.div`{
    font-family: Lato, "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 24px;
    font-weight: 300;
    letter-spacing: 1px;
    padding:  10px;
    & > div {
      padding: 20px;
      border-radius: 4px;
      cursor: pointer;
    }
    & > .FactualBoard {
      background: #8bc34a;
      -webkit-box-shadow: 0px 0px 10px 0px rgba(124, 179, 66, .7);
      -moz-box-shadow:    0px 0px 10px 0px rgba(124, 179, 66, .7);
      box-shadow:         0px 0px 10px 0px rgba(124, 179, 66, .7);
    }
    & > .SensationalizedBoard {
      background: #ffc107;
      -webkit-box-shadow: 0px 0px 10px 0px rgba(255, 179, 0, .7);
      -moz-box-shadow:    0px 0px 10px 0px rgba(255, 179, 0, .7);
      box-shadow:         0px 0px 10px 0px rgba(255, 179, 0, .7);
    }
    & > .NotVotedBoard {
      background: #03a9f4;
      -webkit-box-shadow: 0px 0px 10px 0px rgba(15, 101, 212, .7);
      -moz-box-shadow:    0px 0px 10px 0px rgba(15, 101, 212, .7);
      box-shadow:         0px 0px 10px 0px rgba(15, 101, 212, .7);
    }
  }
`;

class ArticleList extends Component {
  state = {
    isModalOpen: false,
    selectedArticle: {},
    votingResult: 0,
  }
  componentWillMount() {
    // Fetch user data prior to component mounting
    this.props.fetchArticles();
  }
  openModal = (article) => {
    this.setState({ isModalOpen: true });
    const articleTemp = Object.assign({}, article);
    this.setState({ selectedArticle: articleTemp });
    const user = cookie.load('user');
    const viewedArticle = {
      profile: user,
      _id: this.helperEncoding(article.title),
      title: article.title,
      pubdate: article.pubdate,
      mediaImageURL: article.mediaImageURL,
      link: article.link,
      voted: 0,
    };
    this.props.viewArticle(viewedArticle);
  }
  closeModal = () => {
    this.setState({ isModalOpen: false });
  }
  helperEncoding = (str) => {
    const Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", encode: function(e) {var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
    const encodedString = Base64.encode(str);
    return encodedString;
  }
  OnVote = () => {
    const { selectedArticle, votingResult } = this.state;
    const user = cookie.load('user'); 
    const votedArticle = {
      profile: user,
      _id: this.helperEncoding(selectedArticle.title),
      title: selectedArticle.title,
      pubdate: selectedArticle.pubdate,
      mediaImageURL: selectedArticle.mediaImageURL,
      link: selectedArticle.link,
      voted: votingResult
    }
    if (votingResult !== 0)
    this.props.voteArticle(votedArticle);
  }
  afterChange = (cur) => {
    this.setState({ votingResult: cur-1 });
  }
  render() {
    const { articles } = this.props;
    const { isModalOpen, selectedArticle, votingResult } = this.state;
    const sliderSettings = {
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      initialSlide: 1,
      slidesToScroll: 1,
      afterChange: this.afterChange
    };
    const articleList = articles.map((article, index) => {
      return (
          <div className="col-sm-4" onClick={()=> this.openModal(article)}>
            <ArticleItem >
              <div className='imgContainer'>
                <img src={article.mediaImageURL} />
              </div>
              <div className='articleCaption'>
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
          <div> { selectedArticle.title } <br /></div>
          <div> { selectedArticle.pubdate } <br /></div>
          <div> { selectedArticle.description } <br /></div>
          <br />
          <SwiperContainer>
            <Slider {...sliderSettings}>
              <BoardSlider><div className="SensationalizedBoard">Sensationalized</div></BoardSlider>
              <BoardSlider><div className="NotVotedBoard">No idea</div></BoardSlider>
              <BoardSlider><div className="FactualBoard">Factual</div></BoardSlider>
            </Slider>
          </SwiperContainer>
          <br />
          <br />
          <button onClick={this.OnVote}>Vote now </button>
          <button onClick={this.closeModal}>Cancel </button>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    articles: state.article.articles,
  };
}

export default connect(mapStateToProps, actions)(ArticleList);
