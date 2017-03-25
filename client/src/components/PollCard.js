import React, { Component } from 'react';
import {
  Card,
  CardActions,
  Button,
  Icon,
  Menu,
  MenuItem
} from 'react-mdl';
import PollChart from './PollChart';

class PollCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.pollData.id,
      chosen: this.props.pollData.options[0].name
    };

    // Function Bindings
    this.handleMenuOptionClick = this.handleMenuOptionClick.bind(this);
    this.newOptionHandler = this.newOptionHandler.bind(this);
    this.setUpMenuItems = this.setUpMenuItems.bind(this);
    this.voteHandler = this.voteHandler.bind(this);
  }

  handleMenuOptionClick(e) {
    let option = e.target.innerHTML;
    // The delay is a UI fix not neccessary
    setTimeout(
      () =>
        this.setState({
          chosen: option
        }),
      150
    );
  }

  newOptionHandler() {
    let id = this.state.id;
    this.props.newOptionDialog(id);
  }

  voteHandler() {
    this.props.userVote(this.state.chosen, this.state.id);
  }

  setUpMenuItems(labels) {
    return labels
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
  }

  setUpChosen() {
    let chosen = this.state.chosen;
    if (chosen.length > 9) {
      return chosen.substr(0, 9) + '...';
    }
    return chosen;
  }

  setUpData(labels, votes) {
    return {
      labels: labels,
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
    };
  }

  render() {
    let labels = this.props.pollData.options.map(option => {
      return option.name;
    });
    let votes = this.props.pollData.options.map(option => {
      return option.votes;
    });

    let chosen = this.setUpChosen();
    let menuItems = this.setUpMenuItems(labels);
    let chartData = this.setUpData(labels, votes);

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
        <PollChart
          pollTitle={this.props.pollData.pollTitle}
          chartData={chartData}
        />
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
            onClick={this.voteHandler}
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
