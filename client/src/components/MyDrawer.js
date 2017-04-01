import React from 'react';
import { Drawer, Navigation, Badge, Icon } from 'react-mdl';

const MyDrawer = (
  {
    username,
    userPollCount,
    showUserDashboard,
    showAllPolls,
    loginDialog,
    logoutUser,
    aboutDialog,
  },
) => {
  const divPointer = { cursor: 'pointer' };
  return (
    <Drawer title="Pollster App">
      <Navigation>

        <div
          style={username ? {width: 208} : divPointer}
          onClick={username ? null : loginDialog}
        >
          <Icon name="account_circle" />
          <span className="drawer-link">{username || 'Login'}</span>
        </div>

        <hr
          style={{ pointerEvents: 'none', marginTop: 10 }}
          className="separator"
        />

        {username
          ? <div style={divPointer} onClick={showUserDashboard}>
              <Icon name="home" />
              <Badge text={userPollCount} style={{marginLeft: -12, marginTop: -10}}> </Badge>
              <span className="drawer-link" style={{ marginLeft: 5 }}>
                My Polls
              </span>
            </div>
          : null}

        <div style={divPointer} onClick={showAllPolls}>
          <Icon name="inbox" />
          <span className="drawer-link">All Polls</span>
        </div>

        {username
          ? <div style={divPointer} onClick={logoutUser}>
              <Icon name="exit_to_app" />
              <span className="drawer-link">Logout</span>
            </div>
          : null}

        <div style={divPointer} onClick={aboutDialog}>
          <Icon name="help_outline" />
          <span className="drawer-link">About</span>
        </div>

      </Navigation>
    </Drawer>
  );
};

export default MyDrawer;
