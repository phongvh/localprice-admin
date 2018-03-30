import {combineReducers} from 'redux';
import countries from './countryReducer';
import cities from './cityReducer';
import categories from './categoryReducer';
//import ajaxCallsInProgress from './ajaxStatusReducer';

const rootReducer = combineReducers({
  countries,
  cities,
  categories
  //ajaxCallsInProgress
});

export default rootReducer;
