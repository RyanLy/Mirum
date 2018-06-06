import React from 'react';
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import { database, FIREBASE_SERVER_TIMESTAMP } from './../client';

class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: null, user_id: Object.keys(this.props.users)[0], points: 1, reason: '', update: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ open: nextProps.open, ...nextProps.tableEntry });
    }
  }

  handleChangeSelected(event, index, user_id) {
    this.setState({ user_id });
  }

  handleChangePoints(event, index, points) {
    this.setState({ points });
  }

  handleReasonChange(e) {
    this.setState({
      reason: e.target.value,
    });
  }

  render() {
    const POSSIBLE_POINT_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onTouchTap={this.props.onDone}
      />,
      // TODO: Move the server call out to a parent component
      <FlatButton
        label={this.props.update ? 'Update' : 'Submit'}
        primary
        keyboardFocused
        onTouchTap={
          () => {
            if (this.props.update) {
              const updates = {};
              updates[`table/${this.state.key}`] = {
                user_id: this.state.user_id,
                points: this.state.points,
                reason: this.state.reason,
                updatedAt: FIREBASE_SERVER_TIMESTAMP,
                timestamp: FIREBASE_SERVER_TIMESTAMP,
              };
              database.ref().update(updates, () => {
                this.props.onDone();
              });
            } else {
              database.ref('table').push({
                user_id: this.state.user_id,
                points: this.state.points,
                reason: this.state.reason,
                createdAt: FIREBASE_SERVER_TIMESTAMP,
                timestamp: FIREBASE_SERVER_TIMESTAMP,
              }, () => {
                this.props.onDone();
              });
            }
          }
        }
      />,
    ];

    return (
      <Dialog
        title={this.props.update ? 'Update entry' : 'Add new points entry'}
        actions={actions}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.onDone}
      >
        <div>
          <SelectField
            value={this.state.user_id}
            floatingLabelText="Person"
            onChange={this.handleChangeSelected.bind(this)}
          >
            {
              Object.keys(this.props.users).map(userId => <MenuItem value={userId} primaryText={this.props.users[userId]} />)
            }
          </SelectField>
        </div>
        <div>
          <SelectField value={this.state.points} floatingLabelText="Points" onChange={this.handleChangePoints.bind(this)}>
            {
              POSSIBLE_POINT_VALUES.map(point => <MenuItem value={point} primaryText={point} />)
            }
          </SelectField>
        </div>
        <div>
          <TextField
            floatingLabelText="Reason"
            hintText="They're awesome!"
            multiLine
            fullWidth
            rows={1}
            rowsMax={10}
            floatingLabelFixed
            value={this.state.reason}
            onChange={this.handleReasonChange.bind(this)}
          />
        </div>
      </Dialog>
    );
  }
}

module.exports = EditDialog;
