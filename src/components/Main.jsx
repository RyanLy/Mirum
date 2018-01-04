import React from 'react'
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import MirumTable from './MirumTable.jsx';
import FontIcon from 'material-ui/FontIcon';
import {Card, CardTitle} from 'material-ui/Card';
import { auth, database, FIREBASE_SERVER_TIMESTAMP } from './../client';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, user: null, selected: null, points: 1, reason: '', users: [], tableEntries: [] };
  }

  componentWillMount() {
    auth()
      .onAuthStateChanged(user => {
        if(user) {
          this.setState({user})

          database.ref('/users').once('value').then((snapshot) => {
            const users = snapshot.val();
            // Default to the first key in selected
            if (users) {
              this.setState({ users, selected: Object.keys(users)[0] });
            }
          })

          database.ref('table').on('value', snapshot => {
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
    this.setState({ open: true });
  };

  handleClose() {
    this.setState({ open: false });
  };

  handleChangeSelected(event, index, selected) {
    this.setState({ selected })
  }

  handleChangePoints(event, index, points) {
    this.setState({ points })
  }

  handleReasonChange(e) {
    this.setState({
      reason: e.target.value
    });
  }

  renderAnalytics() {
    const analyticsStyle = {
      marginBottom: '15px'
    }

    const cardStyle = {
      width: '275px',
      marginBottom: '10px'
    }

    const currentUID = this.state.user.uid;
    const totalScore = {};

    Object.keys(this.state.tableEntries).forEach(key => {
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
           <CardTitle title="My Score" subtitle={totalScore[currentUID]} subtitleColor='green' />
         </Card>
        </div>
        {
          everyoneElse.map(userId => {
            const label = `${this.state.users[userId]}'s Score`;
            return (
              <div className="col-md-3">
                <Card style={cardStyle}>
                 <CardTitle title={label} subtitle={totalScore[userId]} subtitleColor='black' />
               </Card>
              </div>
            )
          })
        }
     </div>
    )
  }

  renderAuthorizedContent() {
    const POSSIBLE_POINT_VALUES = [1,2,3,4,5,6,7,8,9,10];
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={
          () => {
            database.ref('table').push({
              user_id: this.state.selected,
              points: this.state.points,
              reason: this.state.reason,
              timestamp: FIREBASE_SERVER_TIMESTAMP
            }, (res) => {
              this.setState({
                selected: Object.keys(this.state.users)[0],
                points: 1,
                reason: ''
              })
              this.handleClose();
            });
          }
        }
      />,
    ];

    return (
      <span>
        {this.renderAnalytics()}
        <div className="row">
          <div className="col-md-12">
          <RaisedButton label="Add points entry"
                        className="pull-right"
                        onTouchTap={this.handleOpen.bind(this)}
                        backgroundColor="#dcdcdc"
                        icon={<FontIcon className="material-icons">add</FontIcon>}
          />
            <Dialog
              title="Add new points entry"
              actions={actions}
              modal={false}
              open={this.state.open}
              onRequestClose={this.handleClose.bind(this)}
            >
              <div>
                <SelectField value={this.state.selected}
                             floatingLabelText="Person"
                             onChange={this.handleChangeSelected.bind(this)}>
                  {
                    Object.keys(this.state.users).map(userId => {
                      return <MenuItem value={userId} primaryText={this.state.users[userId]} />
                    })
                  }
                </SelectField>
              </div>
              <div>
                <SelectField value={this.state.points} floatingLabelText="Points" onChange={this.handleChangePoints.bind(this)}>
                  {
                    POSSIBLE_POINT_VALUES.map(point => {
                      return <MenuItem value={point} primaryText={point} />
                    })
                  }
                </SelectField>
              </div>
              <div>
                <TextField
                  floatingLabelText="Reason"
                  hintText="They're awesome!"
                  multiLine={true}
                  fullWidth={true}
                  rows={1}
                  rowsMax={10}
                  floatingLabelFixed={true}
                  value={this.state.reason}
                  onChange={this.handleReasonChange.bind(this)}
                />
              </div>
            </Dialog>
          </div>
        </div>
        <MirumTable users={this.state.users} tableEntries={this.state.tableEntries} />
      </span>
    )
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
    )
  }

  render() {
    const paddingTop = {
      paddingTop: '20px'
    };

    return (
      <div className="container" style={paddingTop}>
        {this.renderContent()}
      </div>
    )
  }
}

module.exports = Main
