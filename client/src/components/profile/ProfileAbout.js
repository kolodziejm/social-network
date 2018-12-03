import React, { Component } from 'react'
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    const firstName = profile.user.name.trim().split(' ')[0]; // get just the first name from entire user's name
    const skills = profile.skills.map((skill, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" /> {skill}
      </div>
    ));

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            {isEmpty(profile.bio) ? null : <h3 className="text-center text-info">{firstName}'s Bio</h3>}
            {isEmpty(profile.bio) ? null : <p className="lead">{profile.bio}</p>}
            <hr />
            <h3 className="text-center text-info">Skill Set</h3>
            <div className="row">
              {skills}
            </div>
          </div>
        </div>
      </div>
    )
  }
}



export default ProfileAbout;