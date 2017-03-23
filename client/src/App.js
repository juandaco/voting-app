import React, { Component } from 'react';
import { Layout, Content, Icon, FABButton } from 'react-mdl';
// Components
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
      dialogType: 'confirm',
      confirmationText: '',
      currentPollID: '',
      isUserAuth: false,
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
    this.showDashboard = this.showDashboard.bind(this);
    this.getPolls = this.getPolls.bind(this);
    this.createOption = this.createOption.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  componentDidMount() {
    this.getPolls();
  }

  getPolls() {
    ApiCalls.getPolls().then(polls => {
      this.setState({
        pollData: polls
      });
    });
  }

  showDialog() {
    this.setState({
      openDialog: true
    });
  }

  hideDialog() {
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

  userVoteDialog(option) {
    this.confirmationDialog(`You voted for ${option}`);
  }

  createOption(option) {
    this.hideDialog();
    ApiCalls.voteFor(option, this.state.currentPollID).then(result => {
      this.getPolls();
    });
  }

  showDashboard() {
    if (this.state.isUserAuth) {
      // API call to filter user Polls
      // Show Polls
      console.log('Showing Dashboard');
    } else {
      this.loginFirstDialog();
    }
  }

  loginUser() {
    console.log('Login User');
    ApiCalls.loginUser()
      .then(resp => console.log(resp))
      .catch(err => console.log(err));
  }

  render() {
    let pollCards;
    pollCards = this.state.pollData.map((poll, index) => {
      let pollData = {
        id: poll._id,
        pollTitle: poll.title,
        options: poll.options
      };
      return (
        <PollCard
          key={index}
          userVoteDialog={this.userVoteDialog}
          newOptionDialog={this.newOptionDialog}
          pollData={pollData}
        />
      );
    });

    return (
      <div style={{ height: '100vh', position: 'relative' }}>
        <Layout fixedHeader fixedDrawer>
          <MyHeader
            searchValue={this.state.searchValue}
            handleSearchChange={this.handleSearchChange}
            handleSearchKeys={this.handleSearchKeys}
          />
          <MyDrawer
            showDashboard={this.showDashboard}
            loginUser={this.loginUser}
          />
          <Content style={{ flex: 1, height: 100 }}>
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
          createOption={this.createOption}
          currentPollID={this.state.currentPollID}
        />
      </div>
    );
  }
}

export default App;
