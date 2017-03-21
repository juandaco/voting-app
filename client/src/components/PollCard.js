import React, { Component } from 'react';
import {
  Card,
  CardTitle,
  CardActions,
  Button,
  Icon,
  Menu,
  MenuItem,
} from 'react-mdl';
import { Doughnut } from 'react-chartjs-2';

class PollCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosen: '',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Orange', 'Purple', 'Grey'],
        datasets: [
          {
            data: [300, 50, 100, 30, 90, 20, 60],
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#1ABC9C',
              '#EB984E',
              '#AF7AC5',
              '#CACFD2',
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#1ABC9C',
              '#EB984E',
              '#AF7AC5',
              '#CACFD2',
            ],
          },
        ],
      },
    };
    // Function Bindings
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.setState({
      chosen: this.state.data.labels[0],
    });
  }

  handleClick(color) {
    this.setState({
      chosen: color,
    });
  }

  render() {
    let menuItems = this.state.data.labels
      .filter(color => {
        return color !== this.state.chosen;
      })
      .map((color, i) => {
        return (
          <MenuItem key={i} onClick={() => this.handleClick(color)}>
            {color}
          </MenuItem>
        );
      });

    return (
      <Card
        shadow={0}
        style={{
          width: 310,
          margin: 'auto',
          marginTop: 20,
        }}
      >
        <CardTitle
          expand
          style={{
            color: '#000',
          }}
        >
          <div>
            <h4>Colors</h4>
            <Doughnut
              data={this.state.data}
              height={310}
              options={{
                maintainAspectRatio: true,
              }}
            />
          </div>
        </CardTitle>
        <CardActions border>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              float: 'left',
            }}
          >
            <Button id="vote-menu">
              {this.state.chosen}
              <Icon name="arrow_drop_up" />
            </Button>
            <Menu target="vote-menu" valign="top" align="left" ripple>
              {menuItems}
            </Menu>
          </div>
          <Button
            colored
            onClick={this.props.userVote}
            style={{ display: 'inline-block', float: 'right' }}
          >
            Vote{' '}
          </Button>
          <Button
            colored
            onClick={this.props.newOptionDialog}
            style={{ display: 'inline-block', float: 'right' }}
          >
            New Option
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default PollCard;
