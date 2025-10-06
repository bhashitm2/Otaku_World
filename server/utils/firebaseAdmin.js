// server/utils/firebaseAdmin.js
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Check if Firebase credentials are properly configured
const isFirebaseConfigured = () => {
  return (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    !process.env.FIREBASE_PRIVATE_KEY.includes("YOUR_FIREBASE_PRIVATE_KEY_HERE")
  );
};

// Initialize Firebase Admin SDK only if properly configured
let firebaseInitialized = false;

if (isFirebaseConfigured() && process.env.DISABLE_AUTH !== "true") {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
      console.log("✅ Firebase Admin SDK initialized successfully");
      firebaseInitialized = true;
    }
  } catch (error) {
    console.warn("⚠️ Firebase Admin SDK initialization failed:", error.message);
    console.warn(
      "🔧 Running in development mode without Firebase authentication"
    );
    firebaseInitialized = false;
  }
} else {
  console.warn("🔧 Firebase authentication disabled or not configured");
  console.warn(
    "📝 To enable Firebase auth, configure credentials in .env and set DISABLE_AUTH=false"
  );
  firebaseInitialized = false;
}

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    // Bypass authentication in development mode
    if (!firebaseInitialized || process.env.DISABLE_AUTH === "true") {
      req.user = {
        uid: "dev-user-123",
        email: "dev@otakuworld.com",
        name: "Development User",
        picture: "",
        emailVerified: true,
        provider: "development",
        authTime: Math.floor(Date.now() / 1000),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message:
          "No token provided. Authorization header must be 'Bearer <token>'",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      emailVerified: decoded.email_verified,
      authTime: decoded.auth_time,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch (error) {
    console.error("Firebase token verification error:", error);

    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again.",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.code === "auth/id-token-revoked") {
      return res.status(401).json({
        success: false,
        message: "Token revoked. Please login again.",
        code: "TOKEN_REVOKED",
      });
    }

    return res.status(403).json({
      success: false,
      message: "Invalid token. Authentication failed.",
      code: "INVALID_TOKEN",
    });
  }
};
export default admin;
