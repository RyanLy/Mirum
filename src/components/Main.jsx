import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';

import { auth, database } from './../client';
import MirumTable from './MirumTable.jsx';
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
            if (users) {
              this.setState({ users });
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

  handleOpen = () => {
    this.setState({ open: true, tableEntry: { user_id: Object.keys(this.state.users)[0], points: 1, reason: '' } });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  renderAnalytics() {
    const analyticsStyle = {
      marginBottom: 15,
    };

    const cardStyle = {
      width: '100%',
      marginBottom: 10,
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
            <CardContent>
              <Typography variant="headline" style={{ color: 'initial' }}>
                My Score
              </Typography>
              <Typography variant="subheading" style={{ color: 'green' }}>
                {totalScore[currentUID]}
              </Typography>
            </CardContent>
          </Card>
        </div>
        {
          everyoneElse.map((userId) => {
            const label = `${this.state.users[userId].name}'s Score`;
            return (
              <div className="col-md-3">
                <Card style={cardStyle}>
                  <CardContent>
                    <Typography variant="headline" style={{ color: 'initial' }}>
                      {label}
                    </Typography>
                    <Typography variant="subheading">
                      {totalScore[userId]}
                    </Typography>
                  </CardContent>
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
            <Button
              variant="contained"
              className="pull-right"
              onClick={this.handleOpen}
              color="secondary"
            >
              <AddIcon />
              Add points
            </Button>
            <EditDialog
              tableEntry={this.state.tableEntry}
              users={this.state.users}
              open={this.state.open}
              onDone={this.handleClose}
              update={false}
            />
          </div>
        </div>
        <MirumTable users={this.state.users} tableEntries={this.state.tableEntries} />
      </span>
    );
  }

  renderUnauthorizedContent() {
    return <span>You must be logged in/authorized to see this</span>;
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
