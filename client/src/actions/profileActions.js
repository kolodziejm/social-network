import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING, GET_ERRORS, CLEAR_CURRENT_PROFILE, SET_CURRENT_USER, GET_PROFILES } from '../actions/types';

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

// Get profile by handle
export const getProfileByHandle = handle => {
  return async dispatch => {
    dispatch(setProfileLoading());
    try {
      const res = await axios.get(`/api/profile/handle/${handle}`);
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      });
    } catch (err) { // catch - user nie ma jeszcze zalozonego profilu, pusty payload
      dispatch({
        type: GET_PROFILE,
        payload: null
      });
    }
  }
}

// Create profile
export const createProfile = (profileData, history) => {
  return async dispatch => {
    try {
      await axios.post('/api/profile', profileData);
      history.push('/dashboard');
    } catch (err) {
      dispatch({ // errorReducer will take care of this action
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
}

// Add experience
export const addExperience = (expData, history) => {
  return async dispatch => {
    try {
      await axios.post('/api/profile/experience', expData);
      history.push('/dashboard');
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
  };
};

// Add education
export const addEducation = (eduData, history) => {
  return async dispatch => {
    try {
      await axios.post('/api/profile/education', eduData);
      history.push('/dashboard');
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
  };
};

// Delete experience
export const deleteExperience = id => {
  return async dispatch => {
    try {
      const res = await axios.delete(`/api/profile/experience/${id}`);
      console.log(res);
      dispatch({
        type: GET_PROFILE,
        payload: res.data.profile
      })
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
  };
};

// Delete education
export const deleteEducation = id => {
  return async dispatch => {
    try {
      const res = await axios.delete(`/api/profile/education/${id}`);
      console.log(res);
      dispatch({
        type: GET_PROFILE,
        payload: res.data.profile
      })
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
  };
};

// Get all profiles
export const getProfiles = () => {
  return async dispatch => {
    dispatch(setProfileLoading());
    try {
      const res = await axios.get('/api/profile/all');
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    }
  };
};

// Delete profile (DELETES USER AND PROFILE!)
export const deleteAccount = () => {
  return async dispatch => {
    if (window.confirm('Are you sure? This can NOT be undone!')) {
      try {
        await axios.delete('/api/profile');
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      } catch (err) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      }
    }
  }
}