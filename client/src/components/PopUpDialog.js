import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Textfield,
  RadioGroup,
  Radio,
} from 'react-mdl';
import dialogPolyfill from 'dialog-polyfill';

// Loading Logos
import twitterLogo from '../logos/twitterLogo.js';
import facebookLogo from '../logos/facebookLogo.js';
import githubLogo from '../logos/githubLogo.js';
const googleLogo = iconStyle => {
  return (
    <img
      src="/logos/google_plus_logo.svg"
      style={iconStyle}
      alt="Google+ Logo"
    />
  );
};

class PopUpDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newOption: '',
      newPoll: {
        title: '',
        options: '',
      },
    };

    // Function Bindings
    this.handleNewOptionChange = this.handleNewOptionChange.bind(this);
    this.handlePollTitleChange = this.handlePollTitleChange.bind(this);
    this.handlePollOptionsChange = this.handlePollOptionsChange.bind(this);
    this.addNewOption = this.addNewOption.bind(this);
    this.addNewPoll = this.addNewPoll.bind(this);
  }

  handleNewOptionChange(e) {
    this.setState({
      newOption: e.target.value,
    });
  }

  handlePollTitleChange(e) {
    let newPoll = this.state.newPoll;
    newPoll.title = e.target.value;
    this.setState({
      newPoll,
    });
  }

  handlePollOptionsChange(e) {
    let newPoll = this.state.newPoll;
    newPoll.options = e.target.value;
    this.setState({
      newPoll,
    });
  }

  addNewOption() {
    this.props.createPollOption(this.state.newOption);
  }

  addNewPoll() {
    this.props.createPoll(this.state.newPoll);
  }

  render() {
    const open = this.props.open;
    const cancel = this.props.cancel;
    const type = this.props.type;
    const deletePoll = this.props.deletePoll;
    const sharePoll = this.props.sharePoll;
    const loginUser = this.props.loginUser;
    const confirmationText = this.props.confirmationText;
    // For registering the dialogs
    const dialogs = document.querySelector('dialog');
    dialogs && dialogPolyfill.registerDialog(dialogs);

    let iconStyle = {
      width: 35,
      height: 35,
      marginTop: -7,
      marginLeft: 10,
    };

    let content;
    let buttons;
    switch (type) {
      case 'confirm':
        // Prop needed to change value of the property being created
        content = <p>{confirmationText}</p>;
        buttons = (
          <Button type="button" onClick={cancel}>
            OK
          </Button>
        );
        break;

      case 'poll':
        content = (
          <div>
            <Textfield
              onChange={this.handlePollTitleChange}
              label="Title"
              style={{ width: '150px' }}
            />
            <Textfield
              onChange={this.handlePollOptionsChange}
              label="Options (separated by Lines)"
              rows={3}
              style={{ width: '250px' }}
            />
          </div>
        );
        buttons = (
          <div>
            <Button type="button" onClick={cancel}>
              Cancel
            </Button>
            <Button type="button" onClick={this.addNewPoll}>
              Create
            </Button>
          </div>
        );
        break;

      case 'newOption':
        content = (
          <Textfield
            onChange={this.handleNewOptionChange}
            label="New Option"
            style={{ width: 200 }}
          />
        );
        buttons = (
          <div>
            <Button type="button" onClick={cancel}>
              Cancel
            </Button>
            <Button type="button" onClick={this.addNewOption}>
              New
            </Button>
          </div>
        );
        break;

      case 'login':
        const tmp2Style = {
          lineHeight: '60px',
        };
        content = (
          <div>
            <p>Login with:</p>
            <RadioGroup
              container="ul"
              childContainer="li"
              name="loginService"
              style={tmp2Style}
              value="github"
            >
              <Radio value="github">
                {githubLogo(iconStyle)}
              </Radio>
              <Radio value="twitter">
                {twitterLogo(iconStyle)}
              </Radio>
              <Radio value="google">
                {googleLogo(iconStyle)}
              </Radio>
              <Radio value="facebook">
                {facebookLogo(iconStyle)}
              </Radio>
            </RadioGroup>
          </div>
        );
        buttons = (
          <div>
            <Button type="button" onClick={cancel}>
              Cancel
            </Button>
            <Button type="button" onClick={loginUser}>
              OK
            </Button>
          </div>
        );
        break;

      case 'share':
        const tmpStyle = {
          lineHeight: '60px',
        };
        content = (
          <div>
            <p>Share with:</p>
            <RadioGroup
              container="ul"
              childContainer="li"
              name="shareService"
              style={tmpStyle}
              value="twitter"
            >
              <Radio value="twitter">
                {twitterLogo(iconStyle)}
              </Radio>
              <Radio value="google">
                {googleLogo(iconStyle)}
              </Radio>
              <Radio value="facebook">
                {facebookLogo(iconStyle)}
              </Radio>
            </RadioGroup>
          </div>
        );
        buttons = (
          <div>
            <Button type="button" onClick={cancel}>
              Cancel
            </Button>
            <Button type="button" onClick={sharePoll}>
              OK
            </Button>
          </div>
        );
        break;

      case 'delete':
        content = (
          <p>
            Are you sure that you want to delete this poll? It can't be undone!!!
          </p>
        );
        buttons = (
          <div>
            <Button type="button" onClick={cancel}>
              Cancel
            </Button>
            <Button type="button" onClick={deletePoll}>
              OK
            </Button>
          </div>
        );
        break;

      case 'about':
        content = <p>This Page was made by Syntart with for FreeCodeCamp</p>;
        buttons = (
          <Button type="button" onClick={cancel}>
            OK
          </Button>
        );
        break;
      default:
        content = '';
        buttons = '';
    }

    return (
      <Dialog open={open} onCancel={cancel}>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          {buttons}
        </DialogActions>
      </Dialog>
    );
  }
}

export default PopUpDialog;
