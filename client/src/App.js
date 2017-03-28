import React, { Component } from 'react';
import { Layout, Content, Icon, FABButton } from 'react-mdl';
import fuzzysearch from 'fuzzysearch';
// My Components
import MyHeader from './components/MyHeader';
import MyDrawer from './components/MyDrawer';
import PollCard from './components/PollCard';
import PopUpDialog from './components/PopUpDialog';
import ApiCalls from './ApiCalls';

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
      userPolls: [],
      pollFilter: [],
      pollData: [],
    };
    // Method Bindings
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
    this.setUpPollCards = this.setUpPollCards.bind(this);
    this.userVote = this.userVote.bind(this);
    this.verifyUserSession = this.verifyUserSession.bind(this);
    this.showAllPolls = this.showAllPolls.bind(this);
    this.aboutDialog = this.aboutDialog.bind(this);
    this.hideDrawer = this.hideDrawer.bind(this);
  }

  /*
    Lifecycle Hooks
  */
  componentWillMount() {
    this.getPolls();
    this.verifyUserSession();
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

  createPoll(poll) {
    this.hideDialog();
    const pollValidation = poll.title !== '' &&
      poll.options !== '' &&
      /\n/g.test(poll.options);
    if (pollValidation) {
      ApiCalls.newPoll(poll).then(result => {
        if (result.errorMessage) {
          this.confirmationDialog(result.errorMessage);
          this.verifyUserSession();
        } else {
          if (this.state.pollFilter.length) {
            this.getPolls();
          } else {
            this.showUserDashboard();
          }
          this.confirmationDialog('Poll Created');
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

  showAllPolls() {
    this.setState({
      pollFilter: [],
    });
    this.hideDrawer();
  }

  /*
    User Functions
  */
  showUserDashboard() {
    if (this.state.isUserAuth) {
      ApiCalls.getUserPolls().then(resp => {
        this.setState({
          pollFilter: resp.polls,
          userPolls: resp.polls,
        });
        this.hideDrawer();
      });
    } else {
      this.confirmationDialog('You need to login first.');
    }
  }

  loginUser() {
    const w = 360;
    const h = 560;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;
    const authURL = 'http://localhost:3001/auth/github';
    const windowOptions = `width=${w}, height=${h}, top=${top}, left=${left}`;
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

  verifyUserSession() {
    ApiCalls.verifyUser()
      .then(resp => {
        if (resp.isUserAuth) {
          // Set Authenticated State
          this.setState({
            isUserAuth: true,
            username: resp.username,
          });
          this.showUserDashboard();
          this.hideDrawer();
        } else {
          this.setState({
            isUserAuth: false,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  userVote(chosen, id) {
    let pollIndex;
    let poll = this.state.pollData.find((poll, i) => {
      pollIndex = i;
      return id === poll._id;
    });
    let optionIndex = poll.options.findIndex(option => {
      return option.name === chosen;
    });
    let newData = this.state.pollData.slice();
    newData[pollIndex].options[optionIndex].votes++;
    ApiCalls.voteFor(chosen, id)
      .then(results => {
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

  // Drawer Function
  hideDrawer() {
    // Hacky way to hide the Drawer after a successful Login
    const drawer = document.getElementsByClassName('mdl-layout__drawer')[0];
    drawer.classList.remove('is-visible');
    drawer.setAttribute('aria-hidden', true);
    const obfus = document.getElementsByClassName('mdl-layout__obfuscator')[0];
    obfus.classList.remove('is-visible');
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
        };
        let userVisible = true;
        userVisible = this.state.pollFilter.length
          ? this.state.pollFilter.includes(poll._id)
          : true;
        let searchVisible = true;
        if (this.state.searchValue) {
          searchVisible = fuzzysearch(
            this.state.searchValue.toLowerCase(),
            poll.title.toLowerCase(),
          );
        }
        let userActive = this.state.userPolls.includes(poll._id);
        return (
          <PollCard
            key={poll._id}
            userVote={this.userVote}
            userVoteDialog={this.userVoteDialog}
            newOptionDialog={this.newOptionDialog}
            confirmationDialog={this.confirmationDialog}
            pollData={pollData}
            visible={userVisible && searchVisible}
            userActive={userActive}
          />
        );
      });
    } else {
      return null;
    }
  }

  render() {
    let pollCards = this.setUpPollCards();

    return (
      <div style={{ height: '100vh', position: 'relative' }}>
        <Layout fixedHeader fixedDrawer>

          <MyHeader
            title={this.state.pollFilter.length ? 'My Polls' : 'All Polls'}
            searchValue={this.state.searchValue}
            handleSearchChange={this.handleSearchChange}
            handleSearchKeys={this.handleSearchKeys}
          />

          <MyDrawer
            username={this.state.username}
            userPollCount={this.state.userPolls.length}
            showUserDashboard={this.showUserDashboard}
            showAllPolls={this.showAllPolls}
            loginUser={this.loginUser}
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
            {pollCards}
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
        />
      </div>
    );
  }
}

export default App;
