import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { database, FIREBASE_SERVER_TIMESTAMP } from './../client';

class ProposalDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      points: 1, reason: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ open: nextProps.open, ...nextProps.proposal });
    }
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
        open={this.props.open}
        onClose={this.props.onDone}
        fullWidth
      >
        <DialogTitle>
          <Typography variant="title" style={{ marginBottom: 10 }}>
            Submit Proposal
          </Typography>
          <Typography variant="body2" paragraph>
            A short description of what each person has to do to earn the points specified in the proposal. More coming soon!
          </Typography>
          <Typography variant="subheading" style={{ fontWeight: 700 }}>
            Example:
          </Typography>
          <Typography variant="body1">
            For 5 points,<br />
            • Person 1 finishes a V4 bouldering problem. <br />
            • Person 2 finishes a V2 bouldering problem.
          </Typography>
        </DialogTitle>
        <DialogContent>
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
            label="Proposal purpose"
            placeholder="The purpose of life is a life of purpose."
            multiline
            fullWidth
            rows={1}
            rowsMax={10}
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
              database.ref('proposal').push({
                proposed_by: this.props.currentUserID,
                points: this.state.points,
                reason: this.state.reason,
                created_at: FIREBASE_SERVER_TIMESTAMP,
                timestamp: FIREBASE_SERVER_TIMESTAMP,
              }, () => {
                this.props.onDone();
              });
          }}
            color="primary"
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

module.exports = ProposalDialog;
