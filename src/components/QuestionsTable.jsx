import React from 'react';
import moment from 'moment';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { database } from './../client';

function normalizeAnswer(answer) {
  if (!answer) {
    return null;
  }
  return answer.replace(/\s/g, '').toLowerCase();
}

export default class QuestionsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      revealAnswerBox: {},
      rowsPerPage: 10,
      page: 0,
    };
  }

  componentWillMount() {
    const currentUserAnswers = this.props.answers[this.props.currentUserID];
    if (currentUserAnswers) {
      const revealAnswerBox = {};
      Object.keys(currentUserAnswers).forEach((answerKey) => {
        if (currentUserAnswers[answerKey]) {
          revealAnswerBox[answerKey] = true;
        }
      });
      this.setState({ revealAnswerBox });
    }
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleAnswer = (answerKey, currentUserID) => (event) => {
    // TODO, add debounce
    const updates = {};
    updates[`answers/${currentUserID}/${answerKey}`] = event.target.value;
    database.ref().update(updates);
  }

  renderCurrentUserTableCell(answerKey, currentUserAnswer) {
    const currentAnswer = currentUserAnswer && currentUserAnswer[answerKey];
    const revealAnswerBox = { ...this.state.revealAnswerBox };
    revealAnswerBox[answerKey] = true;
    return (
      (this.state.revealAnswerBox[answerKey])
        ? <TextField autoFocus onChange={this.handleAnswer(answerKey, this.props.currentUserID)} value={`${currentAnswer || ''}`} />
        : <Button variant="contained" color="primary" onClick={() => this.setState({ revealAnswerBox })}>Answer</Button>
    );
  }

  render() {
    const tenPxLRMargins = { padding: '0 10px' };
    const tenPxLRMarginsTextCenter = Object.assign({ textAlign: 'center' }, tenPxLRMargins);

    const { page, rowsPerPage } = this.state;
    // Fix this jumbo mess
    const data = Object.keys(this.props.questions)
      .reverse()
      .map((key) => {
        this.props.questions[key].key = key;
        return this.props.questions[key];
      })
      .filter(question => question !== undefined);

    const everyoneElse = Object.keys(this.props.users)
      .filter(userId => userId !== this.props.currentUserID);
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="none" style={tenPxLRMargins}>Trivia Question</TableCell>
              <TableCell padding="none" style={tenPxLRMargins}>Category</TableCell>
              <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">Date</TableCell>
              <TableCell padding="none" style={tenPxLRMarginsTextCenter}>Your Answer</TableCell>
              {
                everyoneElse.map(userId => (
                  <TableCell padding="none" style={tenPxLRMarginsTextCenter}>
                    {`${this.props.users[userId].name}'s Answer`}
                  </TableCell>))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((entry) => {
                const currentUserAnswer = this.props.answers[this.props.currentUserID];
                const styleGreen = { color: 'green' };
                return (
                  <TableRow hover>
                    <TableCell padding="none" style={tenPxLRMargins}>{entry.question}</TableCell>
                    <TableCell padding="none" style={tenPxLRMargins}>{entry.category}</TableCell>
                    <TableCell padding="none" style={tenPxLRMargins} className="hidden-xs">{moment(entry.timestamp).format('MMM Do YYYY h:mm:ss A')}</TableCell>
                    <TableCell padding="none" style={tenPxLRMarginsTextCenter}>
                      { (currentUserAnswer && normalizeAnswer(currentUserAnswer[entry.key])) === normalizeAnswer(entry.answer)
                          ? (
                            <div style={{
                              display: 'flex',
                              flex: 1,
                              justifyContent: 'center',
                            }}
                            >
                              <CheckCircleIcon style={styleGreen} />
                              <Typography variant="subheading" style={styleGreen}>
                                {currentUserAnswer[entry.key]}
                              </Typography>
                            </div>
                            )
                          : this.renderCurrentUserTableCell(entry.key, currentUserAnswer)
                      }
                    </TableCell>
                    {
                      everyoneElse.map((userId) => {
                        const userAnswers = this.props.answers[userId];
                        return (
                          <TableCell padding="none" style={tenPxLRMarginsTextCenter}>
                            { (userAnswers && normalizeAnswer(userAnswers[entry.key])) === normalizeAnswer(entry.answer)
                                  ? <CheckCircleIcon style={styleGreen} />
                                  : <CancelIcon style={{ color: 'red' }} />
                              }
                          </TableCell>
                          );
                      })
                    }
                  </TableRow>
                );
              })
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
