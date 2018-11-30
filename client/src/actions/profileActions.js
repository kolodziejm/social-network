import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE } from '../actions/types';

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}

// Clear profile 
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}


// Get current profile
export const getCurrentProfile = () => {
  return async dispatch => {
    dispatch(setProfileLoading());
    try {
      const res = await axios.get('/api/profile');
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) { // catch - user nie ma jeszcze zalozonego profilu, pusty payload
      dispatch({
        type: GET_PROFILE,
        payload: {}
      });
    }
  }
}