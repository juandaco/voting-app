import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import isEqual from 'lodash.isequal';

class PollCardChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pollTitle: '',
      chartData: {}
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData
    });
  }

  shouldComponentUpdate(nextProps) {
    if (isEqual(this.state.chartData ,nextProps.chartData)) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    return (
      <div>
        <h4>{this.props.Title}</h4>
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
