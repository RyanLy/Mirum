import React from 'react';
import { browserHistory } from 'react-router';

import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';
import Button from '@material-ui/core/Button';

import { provider, auth } from './../client';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, user: null };
  }

  componentWillMount() {
    auth()
      .onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user });
        }
      });
  }

  login = () => {
    auth()
      .signInWithPopup(provider)
      .then((result) => {
        this.setState({ user: result.user });
      });
  }

  logout = () => {
    auth()
      .signOut()
      .then(() => {
        this.setState({ user: null });
      });
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  }

  handleDrawerClose = () => {
    this.setState({ open: false });
  }

  renderLoginButton() {
    return (
      this.state.user
        ?
          <Button color="inherit" onClick={this.logout}>Logout</Button>
        :
          <Button color="inherit" onClick={this.login}>
            <PeopleIcon style={{ marginRight: 10 }} />
            Login With Facebook
          </Button>

    );
  }

  renderUserInfo() {
    const style = {
      margin: 20,
      height: 125,
      width: 125,
      textAlign: 'center',
      display: 'inline-block',
      borderRadius: '50%',
    };
    const textAlign = {
      textAlign: 'center',
    };

    return (
      this.state.user
        ?
          <div style={{ width: 250 }}>
            <div style={textAlign}>
              <img alt="profile" style={style} src={`${this.state.user.providerData[0].photoURL}?height=500`} />
              <Typography
                variant="title"
              >
                {`${this.state.user.displayName}`}
              </Typography>
              <div />
            </div>
          </div>
        :
          <Typography
            variant="title"
            style={{ padding: 20 }}
          >
            You are not logged in!
          </Typography>
    );
  }

  render() {
    const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);
    return (
      <div>
        <SwipeableDrawer
          open={this.state.open}
          onOpen={this.handleDrawerOpen}
          onClose={this.handleDrawerClose}
          onKeyDown={this.handleDrawerClose}
          disableDiscovery={iOS}
        >
          {this.renderUserInfo()}
        </SwipeableDrawer>

        <AppBar>
          <Toolbar>
            <IconButton
              color="inherit"
              onClick={this.handleDrawerOpen}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="headline"
              color="inherit"
              style={{ flex: 1 }}
              noWrap
            >
              <span style={{ cursor: 'pointer' }} onClick={() => browserHistory.push('/')}>
                Mirum
              </span>
            </Typography>
            {this.renderLoginButton()}
          </Toolbar>
        </AppBar>
        <div className="margin-top-app-bar">
          { this.props.children }
        </div>
      </div>
    );
  }
}

module.exports = Index;
