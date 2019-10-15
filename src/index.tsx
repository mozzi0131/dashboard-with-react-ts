import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
//import TOTALTABLE from './components/TOTALTABLE'
//import DATA from './components/FetchDATA';
import MYhook from './components/TESTHook';
import Content from './components/tableExample';

import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<MYhook />, document.getElementById('root'));
ReactDOM.render(<Content />, document.getElementById('root') );
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
