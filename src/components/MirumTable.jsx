import React from 'react'
import moment from 'moment'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';

class MirumTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Table>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Person</TableHeaderColumn>
            <TableHeaderColumn>Points</TableHeaderColumn>
            <TableHeaderColumn>Reason</TableHeaderColumn>
            <TableHeaderColumn className='hidden-xs'>Date</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            Object.keys(this.props.tableEntries).reverse().map((key) => {
              const entry = this.props.tableEntries[key]
              return (
                <TableRow>
                  <TableRowColumn>{this.props.users[entry.user_id]}</TableRowColumn>
                  <TableRowColumn>{entry.points}</TableRowColumn>
                  <TableRowColumn>{entry.reason}</TableRowColumn>
                  <TableRowColumn className='hidden-xs'>{moment(entry.timestamp).format('MMM Do YYYY h:mm:ss A')}</TableRowColumn>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )
  }
}

module.exports = MirumTable
