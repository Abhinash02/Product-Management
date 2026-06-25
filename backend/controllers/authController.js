const User = require('../models/User');
const Product = require('../models/Product');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkeyjwt123456789!@#', {
    expiresIn: '30d'
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  const { name, email, mobile, password, confirmPassword } = req.body;

  try {
    // Basic validation
    if (!name || !email || !mobile || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      mobile,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * @desc    Get user profile data
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      // Calculate dashboard statistics as an extra feature to improve selection
      const totalCreatedProducts = await Product.countDocuments({ owner: user._id });
      const totalLikedProducts = user.likedProducts.length;

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        likedProducts: user.likedProducts,
        stats: {
          createdCount: totalCreatedProducts,
          likedCount: totalLikedProducts
        }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
};

/**
 * @desc    Update user profile details
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateUserProfile = async (req, res) => {
  const { name, email, mobile } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Check if email is being changed and is already taken
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: 'User with this email already exists' });
        }
        user.email = email;
      }

      user.name = name || user.name;
      user.mobile = mobile || user.mobile;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update profile error:', error.message);
    res.status(500).json({ message: error.message || 'Server error updating profile' });
  }
};

/**
 * @desc    Update user password (knowing old password)
 * @route   PUT /api/auth/password
 * @access  Private
 */
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  try {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: 'All password fields are required' });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Get user with password field (since it is excluded by default in protect middleware)
    const user = await User.findById(req.user._id);

    // Check if old password matches
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Assign new password (pre-save middleware in User model will hash it automatically!)
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error.message);
    res.status(500).json({ message: error.message || 'Server error updating password' });
  }
};

/**
 * @desc    Reset password (Forgot password fallback)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  try {
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Email and new password fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No registered user found with this email' });
    }

    // Set new password (will be automatically hashed by pre-save hook)
    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successful! You can now log in.' });
  } catch (error) {
    console.error('Forgot password error:', error.message);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  forgotPassword
};
