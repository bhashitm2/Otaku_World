// server/utils/firebaseAdmin.js
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import dotenv from "dotenv";

dotenv.config();

// Authentication must fail closed. Do not replace a missing Firebase identity
// with a development user: a configuration error must never grant access.
const isFirebaseConfigured = () => {
  return (
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    !process.env.FIREBASE_PRIVATE_KEY.includes("YOUR_FIREBASE_PRIVATE_KEY_HERE")
  );
};

let firebaseInitialized = false;
let firebaseInitializationError = null;
let firebaseApp;

if (isFirebaseConfigured()) {
  try {
    if (!getApps().length) {
      firebaseApp = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    } else {
      firebaseApp = getApps()[0];
    }
    firebaseInitialized = true;
    console.log("✅ Firebase Admin SDK initialized successfully");
  } catch (error) {
    firebaseInitializationError = error;
    console.error("Firebase Admin SDK initialization failed:", error.message);
    firebaseInitialized = false;
  }
} else {
  firebaseInitializationError = new Error(
    "Firebase Admin credentials are missing or incomplete"
  );
  console.error("Firebase Admin SDK is not configured; authentication is unavailable");
  firebaseInitialized = false;
}

export const isFirebaseAdminInitialized = () => firebaseInitialized;

export const getFirebaseInitializationError = () => firebaseInitializationError;

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    if (!firebaseInitialized) {
      return res.status(503).json({
        success: false,
        message: "Authentication service is unavailable",
        code: "AUTH_SERVICE_UNAVAILABLE",
      });
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

    // checkRevoked=true prevents a revoked ID token from remaining usable
    // until its natural expiration time.
    const decoded = await getAuth(firebaseApp).verifyIdToken(token, true);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      emailVerified: decoded.email_verified,
      firebase: decoded.firebase,
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
export default firebaseApp;
