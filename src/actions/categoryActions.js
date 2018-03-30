import * as types from './actionTypes';
import * as firebase from 'firebase';

export function loadCategories() {
	const catRef = firebase.database().ref('category');
  return dispatch => {
    catRef.on('value' , snap => {
    	let data = [];
      let result = snap.val();
      Object.keys(result).map((key) => {
        result[key].id = key;
        data.push(result[key]);
        return null;
      });
    	dispatch({
    		type: types.LOAD_CATEGORIES,
    		categories: data.reverse()
    	})      
    });
  };
}
