import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { addPost } from '../../actions/postActions';

import TextAreaFieldGroup from '../common/TextAreaFieldGroup';


class PostForm extends Component {
  state = {
    text: '',
    errors: {}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  inputChangedHandler = e => this.setState({ [e.target.name]: e.target.value });

  submitHandler = e => {
    e.preventDefault();
    const { user } = this.props.auth; // currently logged in user
    const newPost = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    }
    this.props.addPost(newPost);
    this.setState({ text: '' });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">
            Say Something...
              </div>
          <div className="card-body">
            <form onSubmit={this.submitHandler}>
              <div className="form-group">
                <TextAreaFieldGroup
                  className="form-control form-control-lg"
                  placeholder="Create a post"
                  name="text"
                  value={this.state.text}
                  onChange={this.inputChangedHandler}
                  error={errors.text}
                />
              </div>
              <button type="submit" className="btn btn-dark">Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

PostForm.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addPost: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(mapStateToProps, { addPost })(PostForm);