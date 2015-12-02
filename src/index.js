import './css/chatapp.css';
import './scss/main.scss';
import React from 'react';
import Root from './js/containers/Root';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import ReactDOM from 'react-dom';

const history = new createBrowserHistory();

ReactDOM.render(
  <Root history={history} />,
  document.getElementById('root')
);
