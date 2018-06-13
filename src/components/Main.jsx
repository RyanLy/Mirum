import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import StarsIcon from '@material-ui/icons/Stars';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
// This should be in the redux store
import createHistory from 'history/createBrowserHistory';

import { auth, database } from './../client';
import MirumTable from './MirumTable.jsx';
import QuestionsTable from './QuestionsTable.jsx';
import ProposalTable from './ProposalTable.jsx';
import EditDialog from './EditDialog.jsx';
import ProposalDialog from './ProposalDialog.jsx';

function renderUnauthorizedContent() {
  return <span>You must be logged in/authorized to see this.</span>;
}

const TABS = {
  POINTS: 0,
  QUESTIONS: 1,
  PROPOSALS: 2,
};

class Main extends React.Component {
  constructor(props) {
    super(props);
    let tabNum;
    const { tab } = this.props.location.query;

    if (tab === 'questions') {
      tabNum = TABS.QUESTIONS;
    } else if (tab === 'proposals') {
      tabNum = TABS.PROPOSALS;
    } else {
      tabNum = TABS.POINTS;
    }

    this.state = {
      open: false,
      user: null,
      users: {},
      tableEntries: {},
      questions: {},
      answers: {},
      proposals: {},
      proposalDetails: {},
      tabNum,
      tableEntry: {},
      proposal: {},
    };
  }

  componentWillMount() {
    auth()
      .onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user });

          database.ref('users').on('value', (snapshot) => {
            const users = snapshot.val();
            if (users) {
              this.setState({ users });
            }
          });

          database.ref('table').on('value', (snapshot) => {
            const tableEntries = snapshot.val();
            if (tableEntries) {
              this.setState({ tableEntries });
            }
          }, () => this.setState({ tableEntries: null }));

          database.ref('question').on('value', (snapshot) => {
            const questions = snapshot.val();
            if (questions) {
              this.setState({ questions });
            }
          });

          database.ref('proposal').on('value', (snapshot) => {
            const proposals = snapshot.val();
            if (proposals) {
              this.setState({ proposals });
            }
          }, () => this.setState({ proposals: null }));

          database.ref('proposal_detail').on('value', (snapshot) => {
            const proposalDetails = snapshot.val();
            if (proposalDetails) {
              this.setState({ proposalDetails });
            }
          }, () => this.setState({ proposalDetails: null }));

          database.ref('answers').on('value', (snapshot) => {
            const answers = snapshot.val();
            if (answers) {
              this.setState({ answers });
            }
          });
        } else {
          this.setState({ user: null });
        }
      });
  }

  handleOpen = () => {
    this.setState({ open: true, tableEntry: { user_id: Object.keys(this.state.users)[0], points: 1, reason: '' } });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleOpenProposal = () => {
    this.setState({ openProposal: true, proposal: { proposed_by: this.state.user, points: 1, reason: '' } });
  }

  handleCloseProposal = () => {
    this.setState({ openProposal: false });
  }

  handleTabChange = (_, value) => {
    // Hack: Current using createHistory() for query parameter manipulation...
    if (value === TABS.QUESTIONS) {
      createHistory().push({
        search: '?tab=questions',
      });
    } else if (value === TABS.PROPOSALS) {
      createHistory().push({
        search: '?tab=proposals',
      });
    } else {
      createHistory().push({
        search: '',
      });
    }
    this.setState({ tabNum: value });
  }

  renderAnalytics() {
    const analyticsStyle = {
      marginBottom: 15,
    };

    const cardStyle = {
      width: '100%',
      marginBottom: 10,
    };

    const currentUID = this.state.user.uid;
    const totalScore = {};

    Object.keys(this.state.tableEntries).forEach((key) => {
      const tableEntry = this.state.tableEntries[key];
      if (!totalScore[tableEntry.user_id]) {
        totalScore[tableEntry.user_id] = 0;
      }
      totalScore[tableEntry.user_id] += tableEntry.points;
    });

    const everyoneElse = Object.keys(totalScore).filter(userId => userId !== currentUID);

    return (
      <div className="row" style={analyticsStyle}>
        <div className="col-md-3">
          <Card style={cardStyle}>
            <CardContent>
              <Typography variant="headline" style={{ color: 'initial' }}>
                My Score
              </Typography>
              <Typography variant="subheading" style={{ color: 'green' }}>
                {totalScore[currentUID]}
              </Typography>
            </CardContent>
          </Card>
        </div>
        {
          everyoneElse.map((userId) => {
            const label = `${this.state.users[userId].name}'s Score`;
            return (
              <div className="col-md-3">
                <Card style={cardStyle}>
                  <CardContent>
                    <Typography variant="headline" style={{ color: 'initial' }}>
                      {label}
                    </Typography>
                    <Typography variant="subheading">
                      {totalScore[userId]}
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            );
          })
        }
      </div>
    );
  }

  renderAuthorizedContent() {
    return (
      <div>
        <Tabs
          value={this.state.tabNum}
          onChange={this.handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          style={{ marginBottom: 20, borderBottom: '1px solid #e8e8e8' }}
        >
          <Tab label="Points" icon={<StarsIcon />} />
          <Tab label="Questions"icon={<QuestionAnswerIcon />} />
          <Tab label="Proposals"icon={<FolderSharedIcon />} />
        </Tabs>
        {(this.state.tabNum === TABS.POINTS && this.renderPoints())}
        {(this.state.tabNum === TABS.QUESTIONS && this.renderQuestions())}
        {(this.state.tabNum === TABS.PROPOSALS && this.renderProposals())}
      </div>
    );
  }

  renderPoints() {
    return (
      this.state.tableEntries === null
        ? 'You are probably not authorized for this feature. Contact mirum@ryanly.ca.'
        :
        (
          <span>
            {this.renderAnalytics()}
            <div className="row">
              <div className="col-md-12">
                <Button
                  variant="contained"
                  className="pull-right"
                  onClick={this.handleOpen}
                  color="secondary"
                >
                  <AddIcon />
              Add points
                </Button>
                <EditDialog
                  tableEntry={this.state.tableEntry}
                  users={this.state.users}
                  open={this.state.open}
                  onDone={this.handleClose}
                  update={false}
                />
              </div>
            </div>
            <MirumTable users={this.state.users} tableEntries={this.state.tableEntries} />
          </span>
        )
    );
  }

  renderQuestions() {
    return (<QuestionsTable
      currentUserID={this.state.user.uid}
      users={this.state.users}
      questions={this.state.questions}
      answers={this.state.answers}
    />);
  }

  renderProposals() {
    return (
      this.state.proposals === null
        ? 'You are probably not authorized for this feature. Contact mirum@ryanly.ca.'
        :
        (
          <span>
            <div className="row">
              <div className="col-md-12">
                <Button
                  variant="contained"
                  className="pull-right"
                  onClick={this.handleOpenProposal}
                  color="secondary"
                >
                  <AddIcon />
              Submit Proposal
                </Button>
                <ProposalDialog
                  currentUserID={this.state.user.uid}
                  proposal={this.state.proposal}
                  open={this.state.openProposal}
                  onDone={this.handleCloseProposal}
                  update={false}
                />
              </div>
            </div>
            <ProposalTable
              currentUserID={this.state.user.uid}
              users={this.state.users}
              proposals={this.state.proposals}
              proposalDetails={this.state.proposalDetails}
            />
          </span>
        )
    );
  }

  render() {
    const paddingTop = {
      paddingTop: '20px',
    };

    return (
      <div className="container" style={paddingTop}>
        {
        this.state.user
        ?
        this.renderAuthorizedContent()
        :
        renderUnauthorizedContent()
      }

      </div>
    );
  }
}

module.exports = Main;
