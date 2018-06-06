import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { Card, CardTitle } from 'material-ui/Card';

import MirumTable from './MirumTable.jsx';
import { auth, database } from './../client';
import EditDialog from './EditDialog.jsx';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false, user: null, users: [], tableEntries: [],
    };
  }

  componentWillMount() {
    auth()
      .onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user });

          database.ref('/users').once('value').then((snapshot) => {
            const users = snapshot.val();
            // Default to the first key in selected
            if (users) {
              this.setState({ users, selected: Object.keys(users)[0] });
            }
          });

          database.ref('table').on('value', (snapshot) => {
            const tableEntries = snapshot.val();
            if (tableEntries) {
              this.setState({ tableEntries });
            }
          });
        } else {
          this.setState({ user: null });
        }
      });
  }

  handleOpen() {
    this.setState({ open: true, tableEntry: { user_id: Object.keys(this.state.users)[0], points: 1, reason: '' } });
  }

  handleClose() {
    this.setState({ open: false });
  }

  renderAnalytics() {
    const analyticsStyle = {
      marginBottom: '15px',
    };

    const cardStyle = {
      width: '275px',
      marginBottom: '10px',
    };

    const currentUID = this.state.user.uid;
    const totalScore = {};

    Object.keys(this.state.tableEntries).forEach((key) => {
      const tableEntry = this.state.tableEntries[key];
      if (!totalScore[tableEntry.user_id]) {
        totalScore[tableEntry.user_id] = 0;
      }
      totalScore[tableEntry.user_id] += tableEntry.points;
    });

    const everyoneElse = Object.keys(totalScore).filter(userId => userId !== currentUID);

    return (
      <div className="row" style={analyticsStyle}>
        <div className="col-md-3">
          <Card style={cardStyle}>
            <CardTitle title="My Score" subtitle={totalScore[currentUID]} subtitleColor="green" />
          </Card>
        </div>
        {
          everyoneElse.map((userId) => {
            const label = `${this.state.users[userId]}'s Score`;
            return (
              <div className="col-md-3">
                <Card style={cardStyle}>
                  <CardTitle title={label} subtitle={totalScore[userId]} subtitleColor="black" />
                </Card>
              </div>
            );
          })
        }
      </div>
    );
  }

  renderAuthorizedContent() {
    return (
      <span>
        {this.renderAnalytics()}
        <div className="row">
          <div className="col-md-12">
            <RaisedButton
              label="Add points entry"
              className="pull-right"
              onTouchTap={this.handleOpen.bind(this)}
              backgroundColor="#dcdcdc"
              icon={<FontIcon className="material-icons">add</FontIcon>}
            />
            <EditDialog
              tableEntry={this.state.tableEntry}
              users={this.state.users}
              open={this.state.open}
              onDone={this.handleClose.bind(this)}
              update={false}
            />
          </div>
        </div>
        <MirumTable users={this.state.users} tableEntries={this.state.tableEntries} />
      </span>
    );
  }

  renderUnauthorizedContent() {
    return (<span>You must be logged in/authorized to see this</span>);
  }

  renderContent() {
    return (
      this.state.user
        ?
        this.renderAuthorizedContent()
        :
        this.renderUnauthorizedContent()
    );
  }

  render() {
    const paddingTop = {
      paddingTop: '20px',
    };

    return (
      <div className="container" style={paddingTop}>
        {this.renderContent()}
      </div>
    );
  }
}

module.exports = Main;
