const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      photo: {
        type: String,
      },
      created: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// module.exports = Post = mongoose.model('Post', postSchema);

module.exports = mongoose.model('Post', postSchema);
