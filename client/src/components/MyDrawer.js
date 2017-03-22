import React from 'react';
import { Drawer, Navigation, Icon } from 'react-mdl';

const MyDrawer = ({ showDashboard, loginUser }) => {
  return (
    <Drawer title="Pollster App">
      <Navigation>
        <a href="#" onClick={loginUser}>
          <Icon name="account_circle" />
          <span className="drawer-link">Login</span>
        </a>
        <hr className="separator" />
        <a href="#">
          <Icon name="home" />
          <span className="drawer-link">Home</span>
        </a>
        <a href="#" onClick={showDashboard}>
          <Icon name="inbox" />
          <span className="drawer-link">Dashboard</span>
        </a>
        <a href="#">
          <Icon name="help_outline" />
          <span className="drawer-link">About</span>
        </a>
      </Navigation>
    </Drawer>
  );
};

export default MyDrawer;
