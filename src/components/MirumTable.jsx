import React from 'react';
import moment from 'moment';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';

import EditDialog from './EditDialog.jsx';

class MirumTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      tableEntry: {
        key: null,
        user_id: Object.keys(this.props.users)[0],
        points: 1,
        reason: '',
      },
      rowsPerPage: 10,
      page: 0,
    };
  }

  onDone = () => {
    this.setState({ open: false });
  }

  handleEdit = (entry) => {
    this.setState({ open: true, tableEntry: { ...entry } });
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const tenPxLRMargins = { padding: '0 10px' };
    const { page, rowsPerPage } = this.state;
    const data = Object.keys(this.props.tableEntries).reverse().map((key) => {
      this.props.tableEntries[key].key = key;
      return this.props.tableEntries[key];
    });

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
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(entry => (
                <TableRow hover>
                  <TableCell padding="none" style={tenPxLRMargins}>{this.props.users[entry.user_id].name}</TableCell>
                  <TableCell padding="none" style={tenPxLRMargins}>{entry.points}</TableCell>
                  <TableCell padding="none" style={tenPxLRMargins} title={entry.reason}>{entry.reason}</TableCell>
                  <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">{moment(entry.timestamp).format('MM/DD/YY h:mm A')}</TableCell>
                  <TableCell padding="none" style={tenPxLRMargins} >
                    <Tooltip title="Edit">
                      <IconButton
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.handleEdit(entry)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
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
