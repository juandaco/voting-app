import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

// For React Material Design Lite
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
// In order for Dialogs to work
import 'dialog-polyfill/dialog-polyfill.css';
import 'dialog-polyfill/dialog-polyfill.js';

// Local Files
import App from './App.js';
import './index.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
