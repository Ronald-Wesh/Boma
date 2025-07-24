const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    };
    const usernameExists = await User.findOne({ username });
    if (usernameExists) return res.status(400).json({ message: "Username already exists" });

    if(!email || !email.match(/^\S+@\S+\.\S+$/)){
        return res.status(400).json({ message: 'invalid email format'});
      }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    // Create user
    const user = new User({
      username,
      email,
      passwordHash,
      role: role || 'tenant',
      verifiedLandlord: false,
      verificationStatus: 'pending',
    });
    await user.save();
    // Create JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    };


// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
    exports.getUserProfile = async (req, res) => {
        try {
          const user = await User.findById(req.user._id);
      
          if (user) {
            res.json({
              _id: user._id,
              username: user.username,
              email: user.email,
              isAdmin: user.isAdmin,
              favorites: user.favorites,
              watchlist: user.watchlist,
            });
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      };

      // @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
  
        if (req.body.password) {
          user.password = req.body.password;
        }
  
        const updatedUser = await user.save();
  
        res.json({
          _id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser._id),
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

    // Create JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
