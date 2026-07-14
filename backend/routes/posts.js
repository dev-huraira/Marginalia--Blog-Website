const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');

// @desc    Get all published posts
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user's posts (published + drafts)
// @route   GET /api/posts/my-posts
// @access  Private
router.get('/my-posts', protect, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // If it's a draft, make sure only the author can view it
    if (post.status === 'draft') {
      return res.status(403).json({ success: false, message: 'This draft is private' });
    }

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, excerpt, content, tags, status } = req.body;

  try {
    const post = await Post.create({
      title,
      excerpt,
      content,
      tags: tags ? tags.map(tag => tag.trim()) : [],
      status: status || 'draft',
      author: req.user._id
    });

    res.status(201).json({ success: true, post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, excerpt, content, tags, status } = req.body;

  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Verify ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this post' });
    }

    // Update fields
    post.title = title !== undefined ? title : post.title;
    post.excerpt = excerpt !== undefined ? excerpt : post.excerpt;
    post.content = content !== undefined ? content : post.content;
    post.tags = tags !== undefined ? tags.map(tag => tag.trim()) : post.tags;
    post.status = status !== undefined ? status : post.status;

    await post.save();

    res.json({ success: true, post });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Verify ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Post removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
