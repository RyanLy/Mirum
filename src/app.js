import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  // MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
// import injectTapEventPlugin from 'react-tap-event-plugin';

import Index from './components/Index.jsx';
import Main from './components/Main.jsx';
import Error from './components/Error.jsx';

require('./../styles/app.scss');

const theme = createMuiTheme();
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin();

ReactDOM.render(
  (
    <MuiThemeProvider theme={theme}>
      <Router history={browserHistory}>
        <Route path="/" component={Index}>
          <IndexRoute component={Main} />
          <Route path="*" component={Error} />
        </Route>
      </Router>
    </MuiThemeProvider>
  ), document.getElementById('root'),
);
