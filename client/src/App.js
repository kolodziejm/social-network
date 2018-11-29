import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';

import setAuthToken from './utils/setAuthToken';
import { setCurrentUser, logoutUser } from './actions/authActions';

import './App.css';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import Register from './components/auth/Register';
import Login from './components/auth/Login';

import store from './store';

// TRWALE USTAWIENIE USERA W STORZE, JESLI TOKEN ISTNIEJE. MOZNA W KONSTRUKTORZE KLASY MOIM SPOSOBEM
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);   // Set auth token header auth
  const decoded = jwt_decode(localStorage.jwtToken) // decode token to get user info and expiration date
  store.dispatch(setCurrentUser(decoded)); // set user in the store and isAuth to true

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = '/login'; // w konstruktorze mozna odniesc sie do this.props.history
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;