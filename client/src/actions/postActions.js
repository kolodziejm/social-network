import axios from 'axios';

import { ADD_POST, GET_POSTS, GET_ERRORS, POST_LOADING, DELETE_POST, GET_POST } from './types';

export const addPost = postData => {
  return async dispatch => {
    try {
      const res = await axios.post('/api/posts', postData);
      dispatch({
        type: ADD_POST,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
  }
}

export const getPosts = () => {
  return async dispatch => {
    dispatch(setPostLoading);
    try {
      const res = await axios.get('/api/posts');
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    }
  }
}

export const getPost = id => {
  return async dispatch => {
    dispatch(setPostLoading);
    try {
      const res = await axios.get(`/api/posts/${id}`);
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    } catch (err) {
      dispatch({
        type: GET_POST,
        payload: null
      })
    }
  }
}

export const deletePost = id => {
  return async dispatch => {
    try {
      await axios.delete(`/api/posts/${id}`);
      dispatch({
        type: DELETE_POST,
        payload: id
      });
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
  }
}

export const addLike = id => {
  return async dispatch => {
    try {
      await axios.post(`/api/posts/like/${id}`);
      dispatch(getPosts());
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
  }
}

export const removeLike = id => {
  return async dispatch => {
    try {
      await axios.post(`/api/posts/unlike/${id}`);
      dispatch(getPosts());
    } catch (err) {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    }
  }
}


// SET LOADING STATE
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  }
}