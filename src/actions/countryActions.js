import * as types from './actionTypes';
import * as firebase from 'firebase';
import Helper from '../utils/Helper';

export function loadCountries() {
	const countryRef = firebase.database().ref('country');
  return dispatch => {
    countryRef.on('value' , snap => {
    	//Helper.hideLoading();
    	let data = [];
      let result = snap.val();
      Object.keys(result).map((key) => {
        result[key].id = key;
        data.push(result[key]);
        return null;
      });
    	dispatch({
    		type: types.LOAD_COUNTRIES,
    		countries: data.reverse()
    	})      
    });
  };
}