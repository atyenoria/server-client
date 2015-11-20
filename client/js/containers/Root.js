import React, { Component, PropTypes } from 'react';
import { Redirect, Router, Route } from 'react-router';
import { Provider } from 'react-redux';
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import WelcomePage from '../components/WelcomePage';
import configureStore from '../store/configureStore';
import ChatContainer from './ChatContainer';
import ChatCContainer from './ChatCContainer';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
const store = configureStore();

export default class Root extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired
  }
  render() {
    const processENV = process.env.NODE_ENV;
    const { history } = this.props;
    return (
      <div className="root">
        <Provider store={store} >
          <Router history={history}>
            <Redirect from="/" to="/welcome" />
             <Redirect from="/_=_" to="/chat" />
            <Route path="/welcome" component={WelcomePage} />
            <Route path="/chat" component={ChatContainer} />
            <Route path="/chatc" component={ChatCContainer} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
          </Router>
        </Provider>
        <DebugPanel top right bottom>
                  <DevTools store={store}
                    monitor={LogMonitor}
                    visibleOnLoad={true} />
        </DebugPanel>
      </div>
    );
  }
}
