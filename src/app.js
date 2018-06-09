import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';
import {
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';

import Index from './components/Index.jsx';
import Main from './components/Main.jsx';
import Error from './components/Error.jsx';

require('./../styles/app.scss');

const theme = createMuiTheme({
  typography: {
    fontSize: 20,
  },
});

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
