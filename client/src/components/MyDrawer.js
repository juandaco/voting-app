import React from 'react';
import { Drawer, Navigation, Icon } from 'react-mdl';

const MyDrawer = ({ username, showUserDashboard, loginUser }) => {
  const divPointer = { cursor: 'pointer' };
  return (
    <Drawer title="Pollster App">
      <Navigation>
        <div style={divPointer} onClick={loginUser}>
          <Icon name="account_circle" />
          <span className="drawer-link">{username || 'Login'}</span>
        </div>
        <hr style={{pointerEvents: 'none'}} className="separator" />
        <div style={divPointer}>
          <Icon name="home" />
          <span className="drawer-link">All Polls</span>
        </div>
        <div style={divPointer} onClick={showUserDashboard}>
          <Icon name="inbox" />
          <span className="drawer-link">My Polls</span>
        </div>
        <div style={divPointer}>
          <Icon name="help_outline" />
          <span className="drawer-link">About</span>
        </div>
      </Navigation>
    </Drawer>
  );
};

export default MyDrawer;
