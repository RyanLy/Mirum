import React from 'react';
import { browserHistory } from 'react-router';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';

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

  login() {
    auth()
      .signInWithPopup(provider)
      .then((result) => {
        this.setState({ user: result.user });
      });
  }

  logout() {
    auth()
      .signOut()
      .then(() => {
        this.setState({ user: null });
      });
  }

  handleToggle() { this.setState({ open: !this.state.open }); }

  handleClose() { this.setState({ open: false }); }

  renderLoginButton() {
    return (
      this.state.user
        ?
          <FlatButton label="Logout" onClick={this.logout.bind(this)} />
        :
          <FlatButton label="Login With Facebook" onClick={this.login.bind(this)} icon={<FontIcon className="material-icons">people</FontIcon>} />
    );
  }

  renderUserInfo() {
    const style = {
      height: 100,
      width: 100,
      margin: 20,
      textAlign: 'center',
      display: 'inline-block',
    };
    const imgStyle = {
      height: 100,
      width: 100,
      borderRadius: '50%',
    };
    const textAlign = {
      textAlign: 'center',
    };
    return (
      this.state.user
        ?
          <div>
            <div style={textAlign}>
              <Paper zDepth={2} circle style={style}>
                <img style={imgStyle} src={`${this.state.user.providerData[0].photoURL}?height=500`} />
              </Paper>
              <div>
                {`${this.state.user.displayName}`}
              </div>
            </div>
          </div>
        :
        'You are not logged in'
    );
  }
  render() {
    return (
      <div>
        <AppBar
          style={{ top: 0, position: 'fixed', backgroundColor: '#3b5998' }}
          title={
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => browserHistory.push('/')}
            >
              Mirum
            </span>}
          onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
          iconElementRight={this.renderLoginButton()}
        />
        <Drawer
          docked={false}
          overlayClassName="drawer__overlay"
          containerClassName="drawer__container"
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          {this.renderUserInfo()}
        </Drawer>
        <div className="margin-top-app-bar">
          { this.props.children }
        </div>
      </div>
    );
  }
}

module.exports = Index;
