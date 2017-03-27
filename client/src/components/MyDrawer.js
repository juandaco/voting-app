import React from 'react';
import { Drawer, Navigation, Icon } from 'react-mdl';

const MyDrawer = (
  {
    username,
    showUserDashboard,
    showAllPolls,
    loginUser,
    aboutDialog,
  },
) => {
  const divPointer = { cursor: 'pointer' };
  return (
    <Drawer title="Pollster App">
      <Navigation>

        <div
          style={username ? null : divPointer}
          onClick={username ? null : loginUser}
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
              <span className="drawer-link">My Polls</span>
            </div>
          : null}

        <div style={divPointer} onClick={showAllPolls}>
          <Icon name="inbox" />
          <span className="drawer-link">All Polls</span>
        </div>

        {username
          ? <div style={divPointer}>
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
