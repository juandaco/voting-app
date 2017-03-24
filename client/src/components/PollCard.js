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
import PollChart from './PollChart';
import ApiCalls from '../ApiCalls';

class PollCard extends Component {
  constructor(props) {
    super(props);

    let labels = this.props.pollData.options.map(option => {
      return option.name;
    });
    let votes = this.props.pollData.options.map(option => {
      return option.votes;
    });

    this.state = {
      id: this.props.pollData.id,
      chosen: labels[0],
      data: {
        labels,
        datasets: [
          {
            data: votes,
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
    this.handleMenuOptionClick = this.handleMenuOptionClick.bind(this);
    this.userVote = this.userVote.bind(this);
    this.newOptionHandler = this.newOptionHandler.bind(this);
  }

  handleMenuOptionClick(e) {
    let option = e.target.innerHTML;
    // The dalay is a UI fix not neccessary
    setTimeout(
      () =>
        this.setState({
          chosen: option
        }),
      120
    );
  }

  userVote() {
    let stateData = Object.assign({}, this.state.data);
    let index = stateData.labels.indexOf(this.state.chosen);
    stateData.datasets[0].data[index]++;
    ApiCalls.voteFor(this.state.chosen, this.state.id)
      .then(results => {
        this.setState({
          data: stateData
        });
        this.props.userVoteDialog(this.state.chosen);
      })
      .catch(err => {
        this.props.confirmationDialog(
          'There was an error with your vote, please try again'
        );
      });
  }

  newOptionHandler() {
    let id = this.state.id;
    this.props.newOptionDialog(id);
  }

  render() {
    let menuItems = this.state.data.labels
      .filter(option => {
        return option !== this.state.chosen;
      })
      .map((option, i) => {
        return (
          <MenuItem key={i} onClick={this.handleMenuOptionClick}>
            {option}
          </MenuItem>
        );
      });

    let chosen = this.state.chosen;
    if (chosen.length > 9) {
      chosen = chosen.substr(0, 9) + '...';
    }

    return (
      <Card
        shadow={2}
        style={{
          width: 310,
          height: 470,
          marginTop: 30,
          marginBottom: 20,
          marginLeft: 20,
          marginRight: 20
        }}
      >
        <CardTitle
          expand
          style={{
            color: '#000'
          }}
        >
          <PollChart
            pollTitle={this.props.pollData.pollTitle}
            chartData={this.state.data}
          />
        </CardTitle>
        <CardActions border>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              float: 'left'
            }}
          >
            <Button
              id={`vote-menu${this.state.id}`}
              style={{ width: 130, fontSize: 12 }}
            >
              {chosen}
              <Icon
                name="arrow_drop_up"
                style={{ float: 'right', marginRight: 0, marginTop: 7 }}
              />
            </Button>
            <Menu
              target={`vote-menu${this.state.id}`}
              valign="top"
              align="left"
            >
              {menuItems}
            </Menu>
          </div>
          <Button
            colored
            onClick={this.userVote}
            style={{
              display: 'inline-block',
              float: 'right',
              width: 40,
              padding: 0
            }}
          >
            Vote{' '}
          </Button>
          <Button
            colored
            onClick={this.newOptionHandler}
            style={{
              display: 'inline-block',
              float: 'right',
              width: 100,
              padding: 0
            }}
          >
            New Option
          </Button>
        </CardActions>
      </Card>
    );
  }
}

export default PollCard;
