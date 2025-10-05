import express from "express";
import verifyFirebaseToken from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/sync - Sync Firebase user with database
router.post("/sync", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, name, picture, emailVerified, provider } =
      req.firebaseUser;

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
router.get("/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.firebaseUser;

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
router.put("/profile", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.firebaseUser;
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
router.delete("/account", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid } = req.firebaseUser;

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

export default router;
