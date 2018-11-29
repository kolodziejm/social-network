import axios from 'axios';

// convenience function for not having to set up auth header manually for every request!
const setAuthToken = token => {
  if (token) {
    // Apply to every request
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    // Delete Auth Header
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default setAuthToken;