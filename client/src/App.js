import React, { Component } from 'react';
import { Layout, Content, Icon, FABButton } from 'react-mdl';
// Components
import MyHeader from './components/MyHeader';
import MyDrawer from './components/MyDrawer';
import PollCard from './components/PollCard';
import PopUpDialog from './components/PopUpDialog';

class App extends Component {
  constructor() {
    super();
    this.state = {
      searchValue: '',
      searchFocus: false,
      movie: '',
      openDialog: false,
      dialogType: 'confirm',
      confirmationText: '',
      isUserAuth: true,
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
    this.userVote = this.userVote.bind(this);
    this.showDashboard = this.showDashboard.bind(this);
  }

  showDialog() {
    this.setState({
      openDialog: true,
    });
  }

  hideDialog() {
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

  loginFirstDialog() {
    this.confirmationDialog('You need to login first.');
  }
  newOptionDialog() {
    if (this.state.isUserAuth) {
      this.setState({
        dialogType: 'newOption',
      });
      this.showDialog();
    } else {
      this.loginFirstDialog();
    }
  }

  pollDialog() {
    if (this.state.isUserAuth) {
      this.setState({
        dialogType: 'poll',
      });
      this.showDialog();
    } else {
      this.loginFirstDialog();
    }
  }

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
      // Remove focus from the input
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

  createPoll() {
    // API call with the query Items
    console.log('Creating Poll');
  }

  userVote() {
    // Validate if user already voted
    // if (!this.state.userVoted) {
    // API call to store the user vote
    console.log('Voting');
    this.confirmationDialog('You voted for Red');
    // } else {
    //   this.confirmationDialog('You already voted in this poll');
    // }
  }

  createOption() {
    // API call for creating user option
    console.log('Creating Option');
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

  render() {
    return (
      <div style={{ height: '100vh', position: 'relative' }}>
        <Layout fixedHeader fixedDrawer>
          <MyHeader
            searchValue={this.state.searchValue}
            handleSearchChange={this.handleSearchChange}
            handleSearchKeys={this.handleSearchKeys}
          />
          <MyDrawer showDashboard={this.showDashboard} />
          <Content style={{ flex: 1, height: 100 }}>
            <PollCard
              userVote={this.userVote}
              newOptionDialog={this.newOptionDialog}
            />
            <FABButton
              colored
              style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1 }}
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
        />
      </div>
    );
  }
}

export default App;
