const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [120, 'Title cannot be more than 120 characters']
    },
    excerpt: {
      type: String,
      required: [true, 'Please add a brief pull-quote style excerpt'],
      trim: true,
      maxlength: [300, 'Excerpt cannot be more than 300 characters']
    },
    content: {
      type: String,
      required: [true, 'Please add post content in Markdown'],
      trim: true
    },
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
