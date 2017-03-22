import React, { Component } from 'react';
import {
  Card,
  CardTitle,
  CardActions,
  Button,
  Icon,
  Menu,
  MenuItem
} from 'react-mdl';
import { Doughnut } from 'react-chartjs-2';
import ApiCalls from '../ApiCalls';

class PollCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.pollData.id,
      chosen: '',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#1ABC9C',
              '#EB984E',
              '#AF7AC5',
              '#CACFD2'
            ],
            hoverBackgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#1ABC9C',
              '#EB984E',
              '#AF7AC5',
              '#CACFD2'
            ]
          }
        ]
      }
    };
    // Function Bindings
    this.handleClick = this.handleClick.bind(this);
    this.userVote = this.userVote.bind(this);
  }

  componentDidMount() {
    console.log('Mounted');
    let labels = this.props.pollData.options.map(option => {
      return option.name;
    });
    let votes = this.props.pollData.options.map(option => {
      return option.votes;
    });
    let dataState = this.state.data;
    dataState.labels = labels;
    dataState.datasets[0].data = votes;

    this.setState({
      data: dataState,
      chosen: this.state.data.labels[0]
    });
  }

  handleClick(option) {
    this.setState({
      chosen: option
    });
  }

  userVote() {
    let dataState = this.state.data;
    let index = dataState.labels.indexOf(this.state.chosen);
    dataState.datasets[0].data[index]++;

    ApiCalls.voteFor(this.state.chosen, this.state.id)
      .then(results => {
        this.props.userVoteDialog(this.state.chosen);
        this.setState({
          data: dataState
        });
      })
      .catch(err => {
        // this.props.confirmationDialog(
        //   'There was an error with your vote, please try again'
        // );
      });
  }

  render() {
    let menuItems = this.state.data.labels
      .filter(option => {
        return option !== this.state.chosen;
      })
      .map((option, i) => {
        return (
          <MenuItem key={i} onClick={() => this.handleClick(option)}>
            {option}
          </MenuItem>
        );
      });

    return (
      <Card
        shadow={0}
        style={{
          width: 310,
          margin: 'auto',
          marginTop: 20
        }}
      >
        <CardTitle
          expand
          style={{
            color: '#000'
          }}
        >
          <div>
            <h4>{this.props.pollData.pollTitle}</h4>
            <Doughnut
              data={this.state.data}
              height={310}
              options={{
                maintainAspectRatio: true
              }}
            />
          </div>
        </CardTitle>
        <CardActions border>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              float: 'left'
            }}
          >
            <Button id={`vote-menu${this.state.id}`}>
              {this.state.chosen}
              <Icon name="arrow_drop_up" />
            </Button>
            <Menu
              target={`vote-menu${this.state.id}`}
              valign="top"
              align="left"
              ripple
            >
              {menuItems}
            </Menu>
          </div>
          <Button
            colored
            onClick={this.userVote}
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
