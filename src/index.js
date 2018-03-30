import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';
import configureStore from './store/configureStore';
import {Provider} from 'react-redux';
import {loadCountries} from './actions/countryActions';
import {loadCities} from './actions/cityActions';
import {loadCategories} from './actions/categoryActions';

// Initialize Firebase
// Production
/*var config = {
  apiKey: "AIzaSyDCs7IaB7T1CHg7zxApmPaXiHReZnWO05g",
  authDomain: "localprice-cdd75.firebaseapp.com",
  databaseURL: "https://localprice-cdd75.firebaseio.com",
  storageBucket: "localprice-cdd75.appspot.com",
  messagingSenderId: "478133689317"
};*/

// Developement
var config = {
  apiKey: "AIzaSyATBMhVhwSZusBkPnypClm26ZID6aYXOxE",
  authDomain: "localprice-2febc.firebaseapp.com",
  databaseURL: "https://localprice-2febc.firebaseio.com",
  storageBucket: "localprice-2febc.appspot.com",
  messagingSenderId: "597221751891"
};

firebase.initializeApp(config);

const store = configureStore();
store.dispatch(loadCountries());
store.dispatch(loadCities());
store.dispatch(loadCategories());

ReactDOM.render(
	<Provider store={store}>
  	<App />
  </Provider>,
  document.getElementById('root')
);
