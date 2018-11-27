// combine sub-reducers into root-reducer
import { combineReducers } from 'redux';
import authReducer from './authReducer';

export default combineReducers({
  auth: authReducer
});