import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import { deletePost, addLike, removeLike } from '../../actions/postActions';

class PostItem extends Component {

  deletePostHandler = postId => {
    this.props.deletePost(postId);
  }

  likeHandler = postId => {
    this.props.addLike(postId);
  }

  unlikeHandler = postId => {
    this.props.removeLike(postId);
  }

  findUserLike(likes) { // likes argument - array of likes of the particular post (array of user ids who've liked this post)
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) { // user has liked it, his id is in the likes array
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { post, auth, showActions } = this.props; // showActions from a single post component

    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img className="rounded-circle d-none d-md-block" src={post.avatar}
                alt="" />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {showActions ? (
              <span>
                <button onClick={() => this.likeHandler(post._id)} type="button" className="btn btn-light mr-1">
                  <i className={classnames('fas fa-thumbs-up', {
                    'text-info': this.findUserLike(post.likes)
                  })}></i>
                  <span className="badge badge-light">{post.likes.length}</span> {/* post.likes is an array of user ids who've liked the post */}
                </button>
                <button onClick={() => this.unlikeHandler(post._id)} type="button" className="btn btn-light mr-1">
                  <i className="text-secondary fas fa-thumbs-down"></i>
                </button>
                <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                  Comments
          </Link>
                {post.user === auth.user.id ? ( /* currently logged in user wrote this comment */
                  <button
                    onClick={() => this.deletePostHandler(post._id)}
                    type="button"
                    className="btn btn-danger mr-1">
                    <i className="fas fa-times" />
                  </button>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

PostItem.propTypes = {
  post: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired
};

PostItem.defaultProps = {
  showActions: true
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { deletePost, addLike, removeLike })(PostItem);