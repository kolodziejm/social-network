import { ADD_POST, POST_LOADING, GET_POSTS, DELETE_POST, GET_POST } from '../actions/types';

const initialState = {
  posts: [],
  post: {},
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case POST_LOADING:
      return {
        ...state,
        loading: true
      }

    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts] // adds freshly created post to the array of posts currently in the state
      }

    case GET_POSTS:
      return {
        ...state,
        loading: false,
        posts: action.payload
      }

    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      }

    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload) // zostaw wszystkie posty poza tym z id przekazanym w delete
      }

    default:
      return state;
  }
}