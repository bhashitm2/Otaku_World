// server/middleware/auth.js
import { verifyFirebaseToken } from "../utils/firebaseAdmin.js";
import User from "../models/User.js";

// Firebase authentication middleware
export const protect = async (req, res, next) => {
  await verifyFirebaseToken(req, res, next);
};

// Enhanced protection with user sync
export const protectAndSync = async (req, res, next) => {
  try {
    // First verify Firebase token
    await verifyFirebaseToken(req, res, async () => {
      try {
        // Sync user with MongoDB if not exists
        let user = await User.findByUid(req.user.uid);

        if (!user) {
          // Create new user in MongoDB
          user = new User({
            uid: req.user.uid,
            email: req.user.email,
            name: req.user.name || req.user.email.split("@")[0],
            avatar: req.user.picture || "",
            emailVerified: req.user.emailVerified || false,
            provider: req.user.firebase?.sign_in_provider || "unknown",
            lastLogin: new Date(),
          });

          await user.save();
          console.log(`✅ New user created: ${user.email}`);
        } else {
          // Update last login
          await user.updateLastLogin();
        }

        // Attach MongoDB user to request
        req.mongoUser = user;
        next();
      } catch (error) {
        console.error("User sync error:", error);
        return res.status(500).json({
          success: false,
          message: "User synchronization failed",
        });
      }
    });
  } catch (error) {
    // Error already handled by verifyFirebaseToken
    return;
  }
};

// Role-based authorization
export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.mongoUser) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const userRoles = Array.isArray(req.mongoUser.role)
      ? req.mongoUser.role
      : [req.mongoUser.role];

    const hasRole = roles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

// Admin middleware
export const admin = requireRole(["admin"]);

// Moderator or admin middleware
export const moderator = requireRole(["admin", "moderator"]);

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      await protectAndSync(req, res, next);
    } else {
      next();
    }
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Rate limiting per user
export const rateLimitPerUser = (
  maxRequests = 100,
  windowMs = 15 * 60 * 1000
) => {
  const userRequests = new Map();

  return (req, res, next) => {
    const userId = req.user?.uid || req.ip;
    const now = Date.now();

    if (!userRequests.has(userId)) {
      userRequests.set(userId, { count: 0, resetTime: now + windowMs });
    }

    const userLimit = userRequests.get(userId);

    if (now > userLimit.resetTime) {
      userLimit.count = 0;
      userLimit.resetTime = now + windowMs;
    }

    if (userLimit.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Rate limit exceeded. Please try again later.",
        resetTime: new Date(userLimit.resetTime).toISOString(),
      });
    }

    userLimit.count++;
    next();
  };
};

// Legacy export for backward compatibility
export default protect;
