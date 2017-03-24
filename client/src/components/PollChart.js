import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import isEqual from 'lodash.isequal';

class PollCardChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: this.props.chartData
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log(this.props.pollTitle);
    // console.log(this.state.chartData.datasets[0].data);
    // console.log(nextState.chartData.datasets[0].data);
    if (isEqual(this.state.chartData, nextState.chartData)) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div>
        <h4>{this.props.pollTitle}</h4>
        <Doughnut
          data={this.state.chartData}
          height={310}
          redraw
          options={{
            maintainAspectRatio: true
          }}
        />
      </div>
    );
  }
}

export default PollCardChart;
