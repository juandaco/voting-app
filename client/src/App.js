/* eslint-disable no-lone-blocks */

// Dependencies
import React, { Component } from 'react';
import { Layout, Content, Icon, FABButton } from 'react-mdl';
import fuzzysearch from 'fuzzysearch';
import Delay from 'react-delay'; // To fix Chart.js Bugs
// My Components
import MyHeader from './components/MyHeader';
import MyDrawer from './components/MyDrawer';
import PollCard from './components/PollCard';
import PopUpDialog from './components/PopUpDialog';
// Others
import ApiCalls from './ApiCalls';
import config from './config';


class App extends Component {
  constructor() {
    super();
    this.state = {
      searchValue: '',
      searchFocus: false,
      openDialog: false,
      dialogType: '',
      confirmationText: '',
      currentPollID: '',
      isUserAuth: false,
      username: '',
      userID: '',
      userIP: '',
      userPolls: [],
      userVisible: false,
      sharedPoll: '',
      pollData: [],
    };

    // Method Bindings
    {
      this.handleSearchChange = this.handleSearchChange.bind(this);
      this.handleSearchKeys = this.handleSearchKeys.bind(this);
      this.showDialog = this.showDialog.bind(this);
      this.hideDialog = this.hideDialog.bind(this);
      this.confirmationDialog = this.confirmationDialog.bind(this);
      this.newOptionDialog = this.newOptionDialog.bind(this);
      this.pollDialog = this.pollDialog.bind(this);
      this.createPoll = this.createPoll.bind(this);
      this.userVoteDialog = this.userVoteDialog.bind(this);
      this.showUserDashboard = this.showUserDashboard.bind(this);
      this.getPolls = this.getPolls.bind(this);
      this.createPollOption = this.createPollOption.bind(this);
      this.loginUser = this.loginUser.bind(this);
      this.logoutUser = this.logoutUser.bind(this);
      this.setUpPollCards = this.setUpPollCards.bind(this);
      this.userVote = this.userVote.bind(this);
      this.verifyUserSession = this.verifyUserSession.bind(this);
      this.showAllPolls = this.showAllPolls.bind(this);
      this.aboutDialog = this.aboutDialog.bind(this);
      this.hideDrawer = this.hideDrawer.bind(this);
      this.deletePollDialog = this.deletePollDialog.bind(this);
      this.deletePoll = this.deletePoll.bind(this);
      this.sharePoll = this.sharePoll.bind(this);
      this.scrollContentToTop = this.scrollContentToTop.bind(this);
      this.setupTitle = this.setupTitle.bind(this);
      this.shareDialog = this.shareDialog.bind(this);
      this.loginDialog = this.loginDialog.bind(this);
      this.getUserIP = this.getUserIP.bind(this);
    }
  }

  /*
    Lifecycle Hooks
  */
  componentDidMount() {
    this.getPolls();
    this.verifyUserSession();
    this.getUserIP();
    // Get PollID from the URL
    const pollID = window.location.pathname.slice(7);
    if (pollID) {
      setTimeout(
        () => {
          this.setState({
            sharedPoll: pollID,
          });
        },
        500,
      );
    }
  }

  /*
    Poll Functions
  */
  getPolls() {
    ApiCalls.getPolls().then(polls => {
      this.setState({
        pollData: polls,
      });
    });
  }

  getUserPolls() {
    ApiCalls.getUserPolls().then(resp => {
      this.setState({
        userPolls: resp.polls,
      });
    });
  }

  createPoll(poll) {
    this.hideDialog();
    // Poll validation: Not Empty and at least 2 options
    poll.options = poll.options
      .split(/\n/)
      .filter((option, index, self) => {
        // Remove Empty lines and Duplicates
        if (option.trim()) {
          // Not empty line
          return self.indexOf(option) === index;
        }
        return false;
      })
      .map(option => {
        return {
          name: option.trim(),
          votes: 0,
        };
      });
    const pollValidation = poll.title !== '' && poll.options.length >= 2;
    if (pollValidation) {
      poll.createdBy = this.state.username;
      ApiCalls.newPoll(poll).then(poll => {
        // No errors on the request
        if (!poll.errorMessage) {
          // Update pollData and userPolls
          let newPollData = this.state.pollData.slice();
          newPollData.push(poll);
          let newUserPolls = this.state.userPolls.slice();
          newUserPolls.push(poll._id);
          this.setState({
            pollData: newPollData,
            userPolls: newUserPolls,
          });
          this.confirmationDialog('Poll Created');
        } else {
          this.confirmationDialog(poll.errorMessage);
          this.verifyUserSession();
        }
      });
    } else {
      this.confirmationDialog(
        'The Poll needs a title and at least two options separated by lines',
      );
    }
  }

  createPollOption(option) {
    this.hideDialog();
    ApiCalls.voteFor(option, this.state.currentPollID).then(result => {
      if (result.errorMessage) {
        this.confirmationDialog(result.errorMessage);
        this.verifyUserSession();
      } else {
        this.getPolls();
      }
    });
  }

  showAllPolls(e) {
    // If User Clicked
    if (e) {
      window.history.pushState({}, 'Voting App', config.appURL);
      this.setState({ sharedPoll: '' });
    }
    this.setState({
      userVisible: false,
    });
    this.hideDrawer();
    this.scrollContentToTop();
  }

  sharePoll() {
    this.hideDialog();
    // Get Radio Buttons Value
    const buttons = document.getElementsByName('shareService');
    let shareService;
    buttons.forEach(option => {
      if (option.checked) {
        shareService = option.value;
      }
    });
    const poll = this.state.pollData.find(
      poll => poll._id === this.state.currentPollID,
    );
    let w;
    let h;
    const pollURL = `${config.appURL}/polls/${poll._id}`;
    let shareURL;
    if (shareService === 'facebook') {
      h = 276;
      w = 550;
      shareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pollURL)}`;
    } else if (shareService === 'twitter') {
      // Twitter Web Intent
      h = 276;
      w = 550;
      const tweetText = `Check out this cool Poll: "${poll.title}"`;
      const hashtags = ['FreeCodeCamp', 'VotingApp', 'Pollster'];
      shareURL = `https://twitter.com/intent/tweet?text=${tweetText}&hashtags=${hashtags.join(',')}&url=${pollURL}`;
    } else if (shareService === 'google') {
      // Google Plus share
      w = 400;
      h = 520;
      shareURL = `https://plus.google.com/share?url=${pollURL}`;
    }
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;
    const windowOptions = `width=${w}, height=${h}, top=${top}, left=${left}`;
    window.open(shareURL, 'Voting Tweet', windowOptions);
  }

  deletePoll() {
    ApiCalls.deletePoll(this.state.currentPollID).then(deletedPoll => {
      // Remove from pollData
      let newPollData = this.state.pollData.slice();
      const indexOfPoll = newPollData.findIndex(
        poll => poll._id === deletedPoll._id,
      );
      newPollData.splice(indexOfPoll, 1);
      // Remove from userPolls
      let newUserPolls = this.state.userPolls.slice();
      const indexOfUserPoll = newUserPolls.findIndex(poll => {
        return poll === deletedPoll._id;
      });
      newUserPolls.splice(indexOfUserPoll, 1);
      // New State
      this.setState({
        pollData: newPollData,
        userPolls: newUserPolls,
      });
      // Update View
      if (this.state.userVisible) {
        this.showUserDashboard();
      }
    });
    this.hideDialog();
  }

  /*
    User Functions
  */
  showUserDashboard(e) {
    // Verify if User Clicked
    if (e) {
      window.history.pushState({}, 'Voting App', config.appURL);
      this.setState({
        sharedPoll: '',
        userVisible: true,
      });
    }
    // Set User Visible only when not displaying a particular Poll
    if (!this.state.sharedPoll) {
      this.setState({
        userVisible: true,
      });
    }
    this.hideDrawer();
    this.scrollContentToTop();
  }

  loginUser() {
    this.hideDialog();
    // Get Radio Buttons Value
    const radioButtons = document.getElementsByName('loginService');
    let loginService;
    radioButtons.forEach(option => {
      if (option.checked) {
        loginService = option.value;
      }
    });
    let w, h;
    if (loginService === 'github') {
      w = 360;
      h = 570;
    } else if (loginService === 'twitter') {
      w = 360;
      h = 560;
    } else if (loginService === 'google') {
      w = 460;
      h = 300;
    } else if (loginService === 'facebook') {
      w = 622;
      h = 560;
    }
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;
    const windowOptions = `width=${w}, height=${h}, top=${top}, left=${left}`;
    const authURL = `http://localhost:3001/auth/${loginService}`;
    const oAuthPopUp = window.open(authURL, 'Github OAuth', windowOptions);
    // For AutoClosing the popUp once we get an answer
    window.addEventListener(
      'message',
      e => {
        if (e.data === 'closePopUp') {
          oAuthPopUp.close();
          this.verifyUserSession();
          window.removeEventListener('message', function(e) {}, false);
        }
      },
      false,
    );
  }

  logoutUser() {
    ApiCalls.userLogout().then(resp => {
      this.setState({
        isUserAuth: false,
        username: '',
        userID: '',
        userPolls: [],
        pollFilter: [],
        searchValue: '',
      });
      this.hideDrawer();
      this.confirmationDialog(resp.logoutMessage);
      this.showAllPolls();
    });
  }

  getUserIP() {
    // Get IP
    ApiCalls.getIP().then(resp => {
      this.setState({
        userIP: resp.ip,
      });
    });
  }

  verifyUserSession() {
    ApiCalls.verifyUser().then(resp => {
      if (resp.isUserAuth) {
        // Set Authenticated State
        this.setState({
          isUserAuth: true,
          username: resp.username,
          userID: resp.userID,
        });
        this.getUserPolls();
        // Bug Fix for React Chart.js not showing Canvas
        setTimeout(
          () => {
            this.showUserDashboard();
          },
          350,
        );
      } else {
        this.setState({
          isUserAuth: false,
        });
      }
    });
  }

  userVote(chosen, pollID) {
    // Get a Particular Poll with its Index
    let pollIndex;
    let poll = this.state.pollData.find((poll, i) => {
      pollIndex = i;
      return poll._id === pollID;
    });
    // Find out if User or IP voted
    let userVoted = false;
    this.state.isUserAuth
      ? // User Logged
        (userVoted = poll.votedBy.includes(this.state.userID))
      : // No user, check the IP
        (userVoted = poll.votedBy.includes(this.state.userIP));
    if (!userVoted) {
      let optionIndex = poll.options.findIndex(option => {
        return option.name === chosen;
      });
      // Copy pollData to avoid Mutations
      let newData = this.state.pollData.slice();
      // Actual Vote
      newData[pollIndex].options[optionIndex].votes++;
      // Add the User to votedBy
      this.state.isUserAuth
        ? newData[pollIndex].votedBy.push(this.state.userID)
        : newData[pollIndex].votedBy.push(this.state.userIP);
      // Request Database Modification
      const identifier = this.state.userID || this.state.userIP;
      ApiCalls.voteFor(chosen, pollID, identifier)
        .then(results => {
          // Modify the State when successful
          this.setState({
            pollData: newData,
          });
          this.userVoteDialog(chosen);
        })
        .catch(err => {
          this.confirmationDialog(
            'There was an error with your vote, please try again',
          );
        });
    } else {
      this.confirmationDialog('You already voted in this Poll');
    }
  }

  /*
    PopUp Dialog Functions
  */
  showDialog() {
    this.setState({
      openDialog: true,
    });
  }

  hideDialog() {
    // this.getPolls();
    this.setState({
      openDialog: false,
    });
  }

  confirmationDialog(text) {
    this.setState({
      dialogType: 'confirm',
      confirmationText: text,
    });
    this.showDialog();
  }

  newOptionDialog(id) {
    if (this.state.isUserAuth) {
      this.setState({
        currentPollID: id,
        dialogType: 'newOption',
      });
      this.showDialog();
    } else {
      this.confirmationDialog('You need to login first');
    }
  }

  pollDialog() {
    if (this.state.isUserAuth) {
      this.setState({
        dialogType: 'poll',
      });
      this.showDialog();
    } else {
      this.confirmationDialog('You need to login first.');
    }
  }

  userVoteDialog(option) {
    this.confirmationDialog(`You voted for ${option}`);
  }

  aboutDialog() {
    this.setState({
      dialogType: 'about',
    });
    this.showDialog();
    this.hideDrawer();
  }

  deletePollDialog(pollID) {
    this.setState({
      currentPollID: pollID,
      dialogType: 'delete',
    });
    this.showDialog();
  }

  shareDialog(pollID) {
    this.setState({
      currentPollID: pollID,
      dialogType: 'share',
    });
    this.showDialog();
  }

  loginDialog() {
    this.setState({
      dialogType: 'login',
    });
    this.showDialog();
  }

  /*
    UI Functions
  */
  hideDrawer() {
    // Hacky way to hide the Drawer after a successful Login
    const drawer = document.getElementsByClassName('mdl-layout__drawer')[0];
    drawer.classList.remove('is-visible');
    drawer.setAttribute('aria-hidden', true);
    const obfus = document.getElementsByClassName('mdl-layout__obfuscator')[0];
    obfus.classList.remove('is-visible');
  }

  scrollContentToTop() {
    const content = document.getElementsByClassName('mdl-layout__content')[0];
    content.scrollTop = 0;
  }

  setupTitle() {
    let title;
    if (this.state.sharedPoll && this.state.pollData.length) {
      const poll = this.state.pollData.find(
        poll => poll._id === this.state.sharedPoll,
      );
      title = poll.title;
    } else {
      title = this.state.userVisible ? 'My Polls' : 'All Polls';
    }
    return title;
  }

  /*
    Search Funtions 
  */
  handleSearchChange(e) {
    const value = e.target.value;
    this.setState({
      searchValue: value,
    });
  }

  handleSearchKeys(e) {
    const textInput = document.getElementById('textfield-Search');
    if (e.keyCode === 27) {
      // Erase Search Text
      this.setState({ searchValue: '' });
      textInput.blur();
    } else if (e.keyCode === 13) {
      // Perform search
      textInput.blur();
    }
  }

  setUpPollCards() {
    if (Array.isArray(this.state.pollData)) {
      return this.state.pollData.map(poll => {
        let pollData = {
          id: poll._id,
          pollTitle: poll.title,
          options: poll.options,
          createdBy: poll.createdBy,
        };
        let userVisible = true;
        userVisible = this.state.userVisible
          ? this.state.userPolls.includes(poll._id)
          : true;
        let searchVisible = true;
        if (this.state.searchValue) {
          searchVisible = fuzzysearch(
            this.state.searchValue.toLowerCase(),
            poll.title.toLowerCase(),
          );
        }
        let sharedVisible = !this.state.sharedPoll;
        if (poll._id === this.state.sharedPoll) sharedVisible = true;
        let showDelete = this.state.userPolls.includes(poll._id);
        return (
          // The manual Delay fixes a bug in Chart.js
          (
            <Delay wait={300} key={poll._id}>
              <PollCard
                key={poll._id}
                userVote={this.userVote}
                userVoteDialog={this.userVoteDialog}
                newOptionDialog={this.newOptionDialog}
                confirmationDialog={this.confirmationDialog}
                pollData={pollData}
                visible={userVisible && searchVisible && sharedVisible}
                showDelete={showDelete}
                shareDialog={this.shareDialog}
                deletePollDialog={this.deletePollDialog}
              />
            </Delay>
          )
        );
      });
    } else {
      return null;
    }
  }

  render() {
    return (
      <div style={{ height: '100vh', position: 'relative' }}>
        <Layout fixedHeader fixedDrawer>

          <MyHeader
            title={this.setupTitle()}
            searchValue={this.state.searchValue}
            handleSearchChange={this.handleSearchChange}
            handleSearchKeys={this.handleSearchKeys}
          />

          <MyDrawer
            username={this.state.username}
            userPollCount={this.state.userPolls.length}
            showUserDashboard={this.showUserDashboard}
            showAllPolls={this.showAllPolls}
            loginDialog={this.loginDialog}
            logoutUser={this.logoutUser}
            aboutDialog={this.aboutDialog}
          />

          <Content
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {this.setUpPollCards()}
            {this.state.userPolls.length === 0 && this.state.userVisible
              ? <Delay wait={250}>
                  <h4
                    style={{
                      marginTop: 200,
                      lineHeight: 1.6,
                      textAlign: 'center',
                      color: 'rgba(128, 128, 128, 0.64)',
                    }}
                  >
                    You don't have any polls!
                  </h4>
                </Delay>
              : null}
            <FABButton
              colored
              accent
              style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1 }}
              onClick={this.pollDialog}
            >
              <Icon name="add" />
            </FABButton>
          </Content>
        </Layout>

        <PopUpDialog
          open={this.state.openDialog}
          cancel={this.hideDialog}
          type={this.state.dialogType}
          confirmationText={this.state.confirmationText}
          createPoll={this.createPoll}
          createPollOption={this.createPollOption}
          currentPollID={this.state.currentPollID}
          sharePoll={this.sharePoll}
          loginUser={this.loginUser}
          deletePoll={this.deletePoll}
        />
      </div>
    );
  }
}

export default App;
