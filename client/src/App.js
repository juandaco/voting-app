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
      isUserAuth: true,
      pollData: []
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
  }

  /*
    Lifecycle Hooks
  */
  componentDidMount() {
    this.getPolls();
    // this.verifyUser();
  }

  /*
    Poll Functions
  */
  getPolls() {
    ApiCalls.getPolls().then(polls => {
      this.setState({
        pollData: polls
      });
    });
  }

  searchPolls() {
    // Search DataBase for Polls
  }

  createPoll(poll) {
    this.hideDialog();
    ApiCalls.newPoll(poll).then(result => {
      this.getPolls();
      this.confirmationDialog('Poll Created');
    });
  }

  createPollOption(option) {
    this.hideDialog();
    ApiCalls.voteFor(option, this.state.currentPollID).then(result => {
      this.getPolls();
    });
  }

  /*
    User Functions
  */
  showUserDashboard() {
    if (this.state.isUserAuth) {
      // API call to filter user Polls
      // Show Polls
      console.log('Showing Dashboard');
    } else {
      this.loginFirstDialog();
    }
  }

  loginUser() {
    const w = 360;
    const h = 560;
    const left = screen.width / 2 - w / 2;
    const top = screen.height / 2 - h / 2;
    const authURL = 'http://localhost:3001/auth/github';
    const windowOptions = `width=${w}, height=${h}, top=${top}, left=${left}`;
    window.open(authURL, 'Github OAuth', windowOptions);
  }

  verifyUser() {
    // if (userVerified) {
    //   this.setState({
    //     isUserAuth: true
    //   })
    // } else {
    //   this.setState({
    //     isUserAuth: false
    //   })
    // }
  }

  /*
    PopUp Dialog Functions
  */
  showDialog() {
    this.setState({
      openDialog: true
    });
  }

  hideDialog() {
    // this.getPolls();
    this.setState({
      openDialog: false
    });
  }

  confirmationDialog(text) {
    this.setState({
      dialogType: 'confirm',
      confirmationText: text
    });
    this.showDialog();
  }

  loginFirstDialog() {
    this.confirmationDialog('You need to login first.');
  }

  newOptionDialog(id) {
    this.setState({
      currentPollID: id
    });
    if (this.state.isUserAuth) {
      this.setState({
        dialogType: 'newOption'
      });
      this.showDialog();
    } else {
      this.loginFirstDialog();
    }
  }

  pollDialog() {
    if (this.state.isUserAuth) {
      this.setState({
        dialogType: 'poll'
      });
      this.showDialog();
    } else {
      this.loginFirstDialog();
    }
  }

  userVoteDialog(option) {
    this.confirmationDialog(`You voted for ${option}`);
  }

  /*
    Search Funtions 
  */
  handleSearchChange(e) {
    const value = e.target.value;
    this.setState({
      searchValue: value
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
      console.log('Perform Search');
      textInput.blur();
    }
  }

  render() {
    let pollCards = null;
    pollCards = this.state.pollData
      .filter(poll => {
        return fuzzysearch(
          this.state.searchValue.toLocaleLowerCase(),
          poll.title.toLocaleLowerCase()
        );
      })
      .map(poll => {
        let pollData = {
          id: poll._id,
          pollTitle: poll.title,
          options: poll.options
        };
        return (
          <PollCard
            key={poll._id}
            userVoteDialog={this.userVoteDialog}
            newOptionDialog={this.newOptionDialog}
            confirmationDialog={this.confirmationDialog}
            pollData={pollData}
          />
        );
      });

    return (
      <div style={{ height: '100vh', position: 'relative' }}>
        <Layout fixedHeader fixedDrawer>

          <MyHeader
            title="Home"
            searchValue={this.state.searchValue}
            handleSearchChange={this.handleSearchChange}
            handleSearchKeys={this.handleSearchKeys}
          />

          <MyDrawer
            showUserDashboard={this.showUserDashboard}
            loginUser={this.loginUser}
          />

          <Content
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            {pollCards}
            <FABButton
              colored
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
