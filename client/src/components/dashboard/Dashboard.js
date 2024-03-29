import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getCurrentProfile, deleteAccount } from '../../actions/profileActions';

import Spinner from '../common/Spinner';

import ProfileActions from './ProfileActions';
import Experience from './Experience';
import Education from './Education';

class Dashboard extends Component {

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  deleteAccountHandler = e => {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    let dashboardContent;
    if (profile === null || loading) { // After logging in, the profile data hasn't been fetched yet
      dashboardContent = <Spinner />
    } else {
      // Check if logged in user has a profile
      if (Object.keys(profile).length > 0) { // obj.keys().length > 0 - something is in that object
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome <Link to={`/profile/${profile.handle}`}>{user.name}</Link></p>
            <ProfileActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div style={{ marginBottom: '60px' }}>
              <button
                className="btn btn-danger"
                onClick={this.deleteAccountHandler}
              >
                Delete My Account
              </button>
            </div>
          </div>
        );
      } else { // Logged in user doesn't have a profile created
        dashboardContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <p>You have not yet setup a profile, you can create it by clicking the button below.</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h1 className="display-4">Dashboard</h1>
              {dashboardContent}
            </div>
          </div>
        </div>
      </div>
    )
  };
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);