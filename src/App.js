import React, { Component } from 'react';
//import logo from './logo.png';
import './styles/App.css';
import './styles/flexboxgrid.css';
//import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {indigo100, indigo500, indigo700} from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import _Frame from './pages/_Frame';
import PageItems from './pages/PageItems';
import PageRequests from './pages/PageRequests';
import PageFeedbacks from './pages/PageFeedbacks';
import PageUsers from './pages/PageUsers';
import PageLocation from './pages/PageLocation';
import PageCategory from './pages/PageCategory';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: indigo500,
    primary2Color: indigo700,
    primary3Color: indigo100,
  },
  appBar: {
    height: 70,
  },
  listItem: {
    color: 'rgba(0, 0, 0, 0.4)'
  }
});

class App extends Component {

  render() {
    return (      
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="App">
          <Router history={hashHistory}>
            <Route path='/' component={_Frame} >
              <IndexRoute component={PageItems} />
              <Route path='requests' component={PageRequests} />
              <Route path='feedbacks' component={PageFeedbacks} />
              <Route path='users' component={PageUsers} />
              <Route path='location' component={PageLocation} />
              <Route path='category' component={PageCategory} />
            </Route>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;