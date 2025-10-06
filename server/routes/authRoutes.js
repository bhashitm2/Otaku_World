import express from "express";
import { protectAndSync } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/sync - Sync Firebase user with database
router.post("/sync", protectAndSync, async (req, res) => {
  try {
    const { uid, email, name, picture, emailVerified, provider } = req.user;

    // Upsert user in MongoDB
    const user = await User.findOneAndUpdate(
      { uid }, // Find by Firebase UID
      {
        uid,
        email: email || "",
        name: name || req.body.name || "",
        avatar: picture || "",
        emailVerified: emailVerified || false,
        provider: provider || "unknown",
        lastLogin: new Date(),
        updatedAt: new Date(),
      },
      {
        upsert: true, // Create if doesn't exist
        new: true, // Return updated document
        runValidators: true,
      }
    );

    res.json({
      success: true,
      user: {
        id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        provider: user.provider,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("User sync error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to sync user data",
    });
  }
});

// GET /api/auth/profile - Get current user profile
router.get("/profile", protectAndSync, async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "Please sync your account first",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        provider: user.provider,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to get user profile",
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put("/profile", protectAndSync, async (req, res) => {
  try {
    const { uid } = req.user;
    const { name, avatar } = req.body;

    const user = await User.findOneAndUpdate(
      { uid },
      {
        ...(name && { name }),
        ...(avatar && { avatar }),
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        error: "User not found",
        message: "Please sync your account first",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        uid: user.uid,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        emailVerified: user.emailVerified,
        provider: user.provider,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to update user profile",
    });
  }
});

// DELETE /api/auth/account - Delete user account
router.delete("/account", protectAndSync, async (req, res) => {
  try {
    const { uid } = req.user;

    // Delete user from database
    const deletedUser = await User.findOneAndDelete({ uid });

    if (!deletedUser) {
      return res.status(404).json({
        error: "User not found",
        message: "User account not found in database",
      });
    }

    res.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to delete user account",
    });
  }
});

// POST /api/auth/verify - Verify Firebase token
router.post("/verify", protectAndSync, (req, res) => {
  // If middleware passes, token is valid
  res.json({
    success: true,
    message: "Token verified successfully",
    user: {
      uid: req.user.uid,
      email: req.user.email,
      displayName: req.user.name || req.user.displayName,
      photoURL: req.user.picture || req.user.photoURL,
      emailVerified: req.user.email_verified || false,
      role: req.user.role || "user",
    },
  });
});

// GET /api/auth/me - Get current user info
router.get("/me", protectAndSync, (req, res) => {
  res.json({
    success: true,
    user: {
      uid: req.user.uid,
      email: req.user.email,
      displayName: req.user.name || req.user.displayName,
      photoURL: req.user.picture || req.user.photoURL,
      emailVerified: req.user.email_verified || false,
      role: req.user.role || "user",
      createdAt: req.user.createdAt,
      lastLoginAt: req.user.lastLoginAt,
      preferences: req.user.preferences,
    },
  });
});

// POST /api/auth/refresh - Refresh user data
router.post("/refresh", protectAndSync, async (req, res) => {
  try {
    // The protectAndSync middleware will handle syncing user data
    res.json({
      success: true,
      message: "User data refreshed successfully",
      user: {
        uid: req.user.uid,
        email: req.user.email,
        displayName: req.user.name || req.user.displayName,
        photoURL: req.user.picture || req.user.photoURL,
        emailVerified: req.user.email_verified || false,
        role: req.user.role || "user",
      },
    });
  } catch (error) {
    console.error("Error refreshing user data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh user data",
      error: error.message,
    });
  }
});

// POST /api/auth/signout - Sign out endpoint
router.post("/signout", (req, res) => {
  res.json({
    success: true,
    message:
      "Signed out successfully. Please clear your local Firebase session.",
  });
});

export default router;
