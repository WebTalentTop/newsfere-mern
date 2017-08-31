import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import styled from 'styled-components';
import {Line} from 'react-chartjs-2';
import * as actions from '../../actions/article';


class VoteChart extends Component {
  componentWillMount() {
    // Fetch user data prior to component mounting
    const user = cookie.load('user');
    this.props.fetchArticleChartInfo(user._id);
  }
  render() {
    const { dateInfo, voteInfo, voteFactual, voteSensational } = this.props.chartInfo;
    const chartOption = {
      labels: dateInfo,
      datasets: [
        {
          label: 'Time/Vote Chart',
          fill: false,
          lineTension: 1,
          backgroundColor: '#42a5f5',
          borderColor: '#42a5f5',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#42a5f5',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#42a5f5',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: voteInfo,
        },
        {
          label: 'Factual Vote',
          fill: false,
          lineTension: 1,
          backgroundColor: '#8bc34a',
          borderColor: '#8bc34a',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#8bc34a',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#8bc34a',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: voteFactual,
        },
        {
          label: 'Sensational Vote',
          fill: false,
          lineTension: 1,
          backgroundColor: '#ffc400',
          borderColor: '#ffc400',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0,
          borderJoinStyle: 'miter',
          pointBorderColor: '#ffc400',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: '#ffc400',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: voteSensational,
        }
      ]
    };
    return (
        <div><Line data={chartOption} /></div>
    )
  }
}

function mapStateToProps(state) {
  return {
    chartInfo: state.article.chartInfo,
  };
}

export default connect(mapStateToProps, actions)(VoteChart);
