import React from 'react'
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import Index from './components/Index.jsx'
import Main from './components/Main.jsx'
import Error from './components/Error.jsx'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
require('./../styles/app.sass');

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

ReactDOM.render((
  <MuiThemeProvider>
    <Router history={browserHistory}>
      <Route path="/" component={Index}>
        <IndexRoute component={Main} />
        <Route path="*" component={Error} />
      </Route>
    </Router>
  </MuiThemeProvider>
), document.getElementById('root'))
