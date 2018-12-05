import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';

import { addComment } from '../../actions/postActions';

import TextAreaFieldGroup from '../common/TextAreaFieldGroup';


class CommentForm extends Component {
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
    const { postId } = this.props;
    const newComment = {
      text: this.state.text,
      name: user.name,
      avatar: user.avatar
    }
    this.props.addComment(postId, newComment);
    this.setState({ text: '' });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="post-form mb-3">
        <div className="card card-info">
          <div className="card-header bg-info text-white">
            Make a comment...
              </div>
          <div className="card-body">
            <form onSubmit={this.submitHandler}>
              <div className="form-group">
                <TextAreaFieldGroup
                  className="form-control form-control-lg"
                  placeholder="Reply to post"
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

CommentForm.propTypes = {
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addComment: PropTypes.func.isRequired,
  postId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(mapStateToProps, { addComment })(CommentForm);