import React from 'react';
import moment from 'moment';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import FontIcon from 'material-ui/FontIcon';

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

  handleEdit(entry) {
    this.setState({ open: true, tableEntry: { ...entry } });
  }

  onDone() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <Table>
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn style={{ width: '120px' }}>Person</TableHeaderColumn>
              <TableHeaderColumn style={{ width: '60px' }}>Points</TableHeaderColumn>
              <TableHeaderColumn>Reason</TableHeaderColumn>
              <TableHeaderColumn style={{ width: '250px' }} className="hidden-xs">Date</TableHeaderColumn>
              <TableHeaderColumn style={{ width: '60px' }} />
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              Object.keys(this.props.tableEntries).reverse().map((key) => {
                const entry = this.props.tableEntries[key];
                entry.key = key;
                return (
                  <TableRow>
                    <TableRowColumn style={{ width: '120px', textOverflow: 'clip' }}>{this.props.users[entry.user_id].name}</TableRowColumn>
                    <TableRowColumn style={{ width: '60px' }}>{entry.points}</TableRowColumn>
                    <TableRowColumn title={entry.reason}>{entry.reason}</TableRowColumn>
                    <TableRowColumn style={{ width: '250px' }} className="hidden-xs">{moment(entry.timestamp).format('MMM Do YYYY h:mm:ss A')}</TableRowColumn>
                    <TableHeaderColumn style={{ width: '60px' }}>
                      <FontIcon className="material-icons" style={{ cursor: 'pointer' }} hoverColor="#f44336" onClick={() => this.handleEdit(entry)}>edit</FontIcon>
                    </TableHeaderColumn>
                  </TableRow>
                );
              })
            }
          </TableBody>
        </Table>
        <EditDialog tableEntry={this.state.tableEntry} users={this.props.users} open={this.state.open} onDone={this.onDone.bind(this)} update />
      </div>
    );
  }
}

module.exports = MirumTable;
