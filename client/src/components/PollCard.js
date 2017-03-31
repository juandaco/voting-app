import React, { Component } from 'react';
import {
  Card,
  CardActions,
  Button,
  IconButton,
  Icon,
  Menu,
  MenuItem,
} from 'react-mdl';
import PollChart from './PollChart';

class PollCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.pollData._id,
      chosen: this.props.pollData.options[0].name,
    };
    // Function Bindings
    this.handleMenuOptionClick = this.handleMenuOptionClick.bind(this);
    this.newOptionHandler = this.newOptionHandler.bind(this);
    this.setUpMenuItems = this.setUpMenuItems.bind(this);
    this.voteHandler = this.voteHandler.bind(this);
    this.setUpDeleteButton = this.setUpDeleteButton.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this);
    this.shareHandler = this.shareHandler.bind(this);
  }

  handleMenuOptionClick(e) {
    let option = e.target.innerHTML;
    // The delay is a UI fix not neccessary
    setTimeout(
      () =>
        this.setState({
          chosen: option,
        }),
      150,
    );
  }

  newOptionHandler() {
    let id = this.state.id;
    this.props.newOptionDialog(id);
  }

  voteHandler() {
    this.props.userVote(this.state.chosen, this.state.id);
  }

  deleteHandler() {
    this.props.deletePollDialog(this.state.id);
  }

  shareHandler() {
    this.props.shareDialog(this.state.id);
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

  setUpDeleteButton() {
    if (this.props.showDelete) {
      return {
        float: 'right',
        marginTop: 5,
        marginRight: 5,
      };
    } else {
      return { display: 'none' };
    }
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
    let deleteButton = this.setUpDeleteButton();
    let createdByDist = 5;
    if (this.props.pollData.createdBy) {
      createdByDist += this.props.pollData.createdBy.length;
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
          marginRight: 20,
          paddingLeft: 0,
          display: this.props.visible ? 'flex' : 'none',
        }}
      >
        <div className="icon-container" style={{ flexAlign: 'flex-end' }}>
          {/* Delete Button only visible for User Polls */}
          <IconButton
            name="delete"
            onClick={this.deleteHandler}
            style={deleteButton}
          />
          <IconButton name="share" onClick={this.shareHandler} />
        </div>

        <PollChart
          pollTitle={this.props.pollData.pollTitle}
          chartData={chartData}
        />

        <p
          style={{
            position: 'absolute',
            bottom: 40,
            right: createdByDist,
            fontSize: 12,
            color: 'rgb(189,189,189)',
          }}
        >
          by {this.props.pollData.createdBy}
        </p>

        <CardActions border>
          <div
            style={{
              position: 'relative',
              display: 'inline-block',
              float: 'left',
            }}
          >
            <Button
              id={`vote-menu${this.state.id}`}
              style={{
                width: 130,
                fontSize: 13,
                fontWeight: 500,
                padding: '0 10px',
              }}
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
              padding: 0,
              fontWeight: 500,
            }}
          >
            Vote
          </Button>
          <Button
            colored
            onClick={this.newOptionHandler}
            style={{
              display: 'inline-block',
              float: 'right',
              width: 100,
              padding: 0,
              fontWeight: 500,
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
