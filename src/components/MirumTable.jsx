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
            <TableHeaderColumn style={{ 'width': '120px' }}>Person</TableHeaderColumn>
            <TableHeaderColumn style={{ 'width': '60px' }}>Points</TableHeaderColumn>
            <TableHeaderColumn>Reason</TableHeaderColumn>
            <TableHeaderColumn style={{ 'width': '250px' }} className='hidden-xs'>Date</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            Object.keys(this.props.tableEntries).reverse().map((key) => {
              const entry = this.props.tableEntries[key]
              return (
                <TableRow>
                  <TableRowColumn style={{ 'width': '120px', 'textOverflow': 'clip' }}>{this.props.users[entry.user_id]}</TableRowColumn>
                  <TableRowColumn style={{ 'width': '60px' }}>{entry.points}</TableRowColumn>
                  <TableRowColumn title={entry.reason}>{entry.reason}</TableRowColumn>
                  <TableRowColumn style={{ 'width': '250px' }} className='hidden-xs'>{moment(entry.timestamp).format('MMM Do YYYY h:mm:ss A')}</TableRowColumn>
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
