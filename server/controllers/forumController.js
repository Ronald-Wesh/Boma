const ForumPost = require('../models/ForumPost');

// Get all forum posts for a listing
exports.getPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({ listing: req.params.listingId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new forum post for a listing
exports.createPost = async (req, res) => {
  try {
    const post = new ForumPost({
      listing: req.params.listingId,
      user: req.user._id,
      content: req.body.content,
    });
    const saved = await post.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a forum post (by owner or admin)
exports.deletePost = async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 