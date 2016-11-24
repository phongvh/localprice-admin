import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDCs7IaB7T1CHg7zxApmPaXiHReZnWO05g",
  authDomain: "localprice-cdd75.firebaseapp.com",
  databaseURL: "https://localprice-cdd75.firebaseio.com",
  storageBucket: "localprice-cdd75.appspot.com",
  messagingSenderId: "478133689317"
};
firebase.initializeApp(config);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
