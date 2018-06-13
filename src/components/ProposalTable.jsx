import React from 'react';
import moment from 'moment';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
import Checkbox from '@material-ui/core/Checkbox';
import { database } from './../client';

class ProposalTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rowsPerPage: 10,
      page: 0,
    };
  }

  handleChangeApproval = proposalId => ((event) => {
    const updates = {};
    updates[`proposal_detail/${proposalId}/approval/${this.props.currentUserID}`] = event.target.checked;
    database.ref().update(updates);
  })

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const tenPxLRMargins = { padding: '0 10px' };
    const tenPxLRMarginsTextCenter = Object.assign({ textAlign: 'center' }, tenPxLRMargins);
    const { page, rowsPerPage } = this.state;

    const { proposalDetails } = this.props;
    const data = Object.keys(this.props.proposals).reverse().map((key) => {
      this.props.proposals[key].key = key;
      return this.props.proposals[key];
    });
    const everyoneElse = Object.keys(this.props.users)
      .filter(userId => userId !== this.props.currentUserID);

    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none" style={tenPxLRMargins} >Proposed By</TableCell>
              <TableCell padding="none" style={tenPxLRMargins} >Points</TableCell>
              <TableCell padding="none" style={tenPxLRMargins}>Reason</TableCell>
              <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">Date</TableCell>
              <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">Approval Date</TableCell>
              <TableCell padding="none" style={tenPxLRMargins}>My Approval</TableCell>
              {
                everyoneElse.map(userId => (
                  <TableCell key={`proposal_table_everyone_header_${userId}`} padding="none" style={tenPxLRMarginsTextCenter}>
                    {`${this.props.users[userId].name}'s Approval`}
                  </TableCell>))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(entry => (
                <TableRow key={`proposal_table_${entry.key}`} hover>
                  <TableCell padding="none" style={tenPxLRMargins}>{this.props.users[entry.proposed_by].name}</TableCell>
                  <TableCell padding="none" style={tenPxLRMargins}>{entry.points}</TableCell>
                  <TableCell padding="none" style={tenPxLRMargins} title={entry.reason}>{entry.reason}</TableCell>
                  <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">{moment(entry.timestamp).format('MM/DD/YY h:mm A')}</TableCell>
                  <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">{entry.approved_at ? moment(entry.approved_at).format('MM/DD/YY h:mm A') : '-'}</TableCell>
                  <TableCell padding="none" style={tenPxLRMargins}>
                    {(proposalDetails[entry.key]
                      && (
                      <Tooltip title={entry.approved_at ? 'Read-only' : 'Change Approval'}>
                        <Checkbox onChange={!entry.approved_at && this.handleChangeApproval(entry.key)} checked={proposalDetails[entry.key].approval[this.props.currentUserID]} disableRipple={entry.approved_at} style={{ color: 'green' }} />
                      </Tooltip>))}
                  </TableCell>
                  {
                    everyoneElse.map(userId => (
                      <TableCell key={`proposal_table_everyone_${userId}`} padding="none" style={tenPxLRMarginsTextCenter}>
                        {(proposalDetails[entry.key]
                          && <Tooltip title="Read-only"><Checkbox checked={proposalDetails[entry.key].approval[userId]} disableRipple style={{ color: 'brown' }} /></Tooltip>)}
                      </TableCell>
                        ))
                }
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
      </div>
    );
  }
}

module.exports = ProposalTable;
