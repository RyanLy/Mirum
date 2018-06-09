import React from 'react';
// import Dialog from 'material-ui/Dialog';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
// import TextField from 'material-ui/TextField';
// import SelectField from 'material-ui/SelectField';
import { database, FIREBASE_SERVER_TIMESTAMP } from './../client';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

class EditDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      key: null, user_id: Object.keys(this.props.users)[0], points: 1, reason: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ open: nextProps.open, ...nextProps.tableEntry });
    }
  }

  handleChangeSelected = (e) => {
    this.setState({ user_id: e.target.value });
  }

  handleChangePoints = (e) => {
    this.setState({ points: e.target.value });
  }

  handleReasonChange = (e) => {
    this.setState({
      reason: e.target.value,
    });
  }

  render() {
    const POSSIBLE_POINT_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
      <Dialog
          // onClose={this.handleClose}
          // actions={actions}
        open={this.props.open}
        onClose={this.props.onDone}
        fullWidth
      >
        <DialogTitle>
          <Typography variant="title">
            {this.props.update ? 'Update entry' : 'Add new points entry'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label="Person"
            value={this.state.user_id}
            onChange={this.handleChangeSelected}
            margin="normal"
            style={{ display: 'block', marginBottom: 10 }}
          >
            {
                Object.keys(this.props.users).map(userId => <MenuItem value={userId}>{this.props.users[userId].name}</MenuItem>)
              }
          </TextField>
          <TextField
            select
            fullWidth
            label="Points"
            value={this.state.points}
            onChange={this.handleChangePoints}
            margin="normal"
            style={{ display: 'block', marginBottom: 10 }}
          >
            {POSSIBLE_POINT_VALUES.map(point => (
              <MenuItem value={point}>
                {point}
              </MenuItem>
              ))}
          </TextField>
          <TextField
            label="Reason"
            placeholder="They're awesome!"
            multiline
            fullWidth
            rows={1}
            rowsMax={10}
            floatingLabelFixed
            value={this.state.reason}
            InputLabelProps={{
                shrink: true,
              }}
            onChange={this.handleReasonChange}

          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onDone} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
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
          }}
            color="primary"
          >
            {this.props.update ? 'Update' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

module.exports = EditDialog;
