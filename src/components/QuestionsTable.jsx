import React from 'react';
import moment from 'moment';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

export default class QuestionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      questions: {},
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
              <TableCell padding="none" style={tenPxLRMargins} >Question</TableCell>
              <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              Object.keys(this.props.questions).reverse().map((key) => {
                const entry = this.props.questions[key];
                entry.key = key;
                return (
                    entry.question ? (
                      <TableRow hover>
                        <TableCell padding="none" style={tenPxLRMargins}>{entry.question}</TableCell>
                        <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">{moment(entry.timestamp).format('MMM Do YYYY h:mm:ss A')}</TableCell>
                      </TableRow>
                    )
                    : null
                );
              })
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}
