import admin from "../config/firebaseAdmin.js";

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No token provided",
        message: 'Authorization header must start with "Bearer "',
      });
    }

    const idToken = authHeader.split("Bearer ")[1];

    if (!idToken) {
      return res.status(401).json({
        error: "No token provided",
        message: "Bearer token is missing",
      });
    }

    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Add Firebase user info to request object
    req.firebaseUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
      picture: decodedToken.picture,
      emailVerified: decodedToken.email_verified,
      provider: decodedToken.firebase.sign_in_provider,
    };

    next();
  } catch (error) {
    console.error("Firebase token verification error:", error);

    // Handle specific Firebase Auth errors
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        error: "Token expired",
        message: "Please sign in again",
      });
    } else if (error.code === "auth/id-token-revoked") {
      return res.status(401).json({
        error: "Token revoked",
        message: "Please sign in again",
      });
    } else {
      return res.status(401).json({
        error: "Invalid token",
        message: "Authentication failed",
      });
    }
  }
};

// Legacy auth middleware (kept for backward compatibility)
const verifyAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // For now, just pass through - implement JWT verification later
  next();
};

export default verifyFirebaseToken;
export { verifyAuth };
