import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
// For React Material Design Lite
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
// In order for Dialogs to work
import 'dialog-polyfill/dialog-polyfill.css';
import 'dialog-polyfill/dialog-polyfill.js';
// Local Files
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
