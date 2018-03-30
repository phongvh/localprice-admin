import * as types from './actionTypes';
import * as firebase from 'firebase';

export function loadCities() {
    const cityRef = firebase.database().ref('city');
    return dispatch => {
        cityRef.on('value', snap => {
            let data = [];
            let result = snap.val();
            Object.keys(result).map((key) => {
                result[key].id = key;
                data.push(result[key]);
                return null;
            });
            dispatch({
                type: types.LOAD_CITIES,
                cities: data.reverse()
            })
        });
    };
}
