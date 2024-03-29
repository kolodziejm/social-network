import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import jwt_decode from 'jwt-decode';

import setAuthToken from '../utils/setAuthToken';

// Register User
export const registerUser = (userData, history) => {
  return async dispatch => {
    try {
      await axios.post('/api/auth/register', userData); // path, data to send
      history.push('/login');
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
}

// Set logged in user with token extracted before dispatching this action
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// Login - Get User Token
export const loginUser = (userData) => {
  return async dispatch => {
    try {
      const res = await axios.post('/api/auth/login', userData);
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      const decoded = jwt_decode(token); // decode jwt in order to get user data stored in it and assign it to decoded.
      dispatch(setCurrentUser(decoded));

    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    }
  }
};

// Logout user
export const logoutUser = () => {
  return async dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false); // else statement will delete the custom auto auth header from future requests
    dispatch(setCurrentUser({})); // authReducer sets the user to the passed argument value, in this case empty object (inAuth default reducer state)
  }
}