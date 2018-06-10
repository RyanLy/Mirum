import React from 'react';
import moment from 'moment';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

import EditDialog from './EditDialog.jsx';

class MirumTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      tableEntry: {
        key: null, user_id: Object.keys(this.props.users)[0], points: 1, reason: '',
      },
    };
  }

  onDone = () => {
    this.setState({ open: false });
  }

  handleEdit = (entry) => {
    this.setState({ open: true, tableEntry: { ...entry } });
  }

  render() {
    const tenPxLRMargins = { padding: '0 10px' };
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none" style={tenPxLRMargins} >Person</TableCell>
              <TableCell padding="none" style={tenPxLRMargins} >Points</TableCell>
              <TableCell padding="none" style={tenPxLRMargins}>Reason</TableCell>
              <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">Date</TableCell>
              <TableCell padding="none" style={tenPxLRMargins} />
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Object.keys(this.props.tableEntries).reverse().map((key) => {
                const entry = this.props.tableEntries[key];
                entry.key = key;
                return (
                  <TableRow hover>
                    <TableCell padding="none" style={tenPxLRMargins}>{this.props.users[entry.user_id].name}</TableCell>
                    <TableCell padding="none" style={tenPxLRMargins}>{entry.points}</TableCell>
                    <TableCell padding="none" style={tenPxLRMargins} title={entry.reason}>{entry.reason}</TableCell>
                    <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">{moment(entry.timestamp).format('MMM Do YYYY h:mm:ss A')}</TableCell>
                    <TableCell padding="none" style={tenPxLRMargins} >
                      <IconButton
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.handleEdit(entry)}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
        <EditDialog
          tableEntry={this.state.tableEntry}
          users={this.props.users}
          open={this.state.open}
          onDone={this.onDone}
          update
        />
      </div>
    );
  }
}

module.exports = MirumTable;
