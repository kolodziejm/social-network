const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: { // connect post to a user from users collection
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  text: {
    type: String,
    required: true
  },
  name: { // filled automatically from the react state ??
    type: String
  },
  avatar: { // filled automatically from the react state ??
    type: String
  },
  likes: [ // likes from other users, array of user ids who clicked a like btn
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: { // comment date
        type: Date,
        default: Date.now()
      }
    }
  ],
  date: { // post date
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('posts', PostSchema);