// server/controllers/userController.js
import User from "../models/User.js";

// Register/sync user with MongoDB
export const registerUser = async (req, res) => {
  try {
    const { uid, email, name, avatar, emailVerified, provider } = req.body;

    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        message: "UID and email are required",
      });
    }

    // Check if user already exists
    let user = await User.findByUid(uid);

    if (user) {
      // Update existing user
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.emailVerified =
        emailVerified !== undefined ? emailVerified : user.emailVerified;
      user.provider = provider || user.provider;
      user.lastLogin = new Date();

      await user.save();

      return res.json({
        success: true,
        message: "User updated successfully",
        data: user.toPublicJSON(),
      });
    }

    // Create new user
    user = new User({
      uid,
      email: email.toLowerCase(),
      name: name || email.split("@")[0],
      avatar: avatar || "",
      emailVerified: emailVerified || false,
      provider: provider || "unknown",
      lastLogin: new Date(),
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Error registering user:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByUid(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar, preferences } = req.body;

    const user = await User.findByUid(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update fields
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences };
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user.toPublicJSON(),
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Delete user account
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByUid(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.deleteOne({ uid: req.user.uid });

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
      error: error.message,
    });
  }
};

// Get user statistics
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findByUid(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Basic user stats (in a real app, you'd get this from favorites/watchlist models)
    const stats = {
      totalFavorites: 0,
      totalWatchlist: 0,
      joinDate: user.createdAt,
      lastLogin: user.lastLogin,
      preferences: user.preferences,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message,
    });
  }
};

// Get user activity
export const getUserActivity = async (req, res) => {
  try {
    const user = await User.findByUid(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Mock activity data (in a real app, you'd track actual user activity)
    const activity = {
      recentActions: [],
      loginHistory: [
        {
          date: user.lastLogin,
          action: "login",
          ip: "xxx.xxx.xxx.xxx",
        },
      ],
      stats: {
        totalLogins: 1,
        favoritesAdded: 0,
        watchlistUpdates: 0,
      },
    };

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user activity",
      error: error.message,
    });
  }
};

// Get user preferences
export const getUserPreferences = async (req, res) => {
  try {
    const user = await User.findByUid(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.preferences || {},
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user preferences",
      error: error.message,
    });
  }
};

// Update user preferences
export const updateUserPreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findByUid(req.user.uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Merge preferences
    user.preferences = { ...user.preferences, ...preferences };
    await user.save();

    res.json({
      success: true,
      message: "Preferences updated successfully",
      data: user.preferences,
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update preferences",
      error: error.message,
    });
  }
};
