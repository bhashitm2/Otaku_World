import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Firebase UID (primary identifier)
    uid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Basic user information
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    avatar: {
      type: String,
      default: "",
    },

    // Firebase-specific fields
    emailVerified: {
      type: Boolean,
      default: false,
    },

    provider: {
      type: String,
      enum: ["google.com", "twitter.com", "password", "unknown"],
      default: "unknown",
    },

    // User preferences and data
    preferences: {
      theme: {
        type: String,
        enum: ["dark", "light", "auto"],
        default: "dark",
      },
      language: {
        type: String,
        default: "en",
      },
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
    },

    // Activity tracking
    lastLogin: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // Admin/role management
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: {
      transform: function (doc, ret) {
        // Remove sensitive fields when converting to JSON
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ uid: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ lastLogin: -1 });

// Virtual for full name (if needed)
userSchema.virtual("fullName").get(function () {
  return this.name;
});

// Instance methods
userSchema.methods.updateLastLogin = function () {
  this.lastLogin = new Date();
  return this.save();
};

userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    uid: this.uid,
    email: this.email,
    name: this.name,
    avatar: this.avatar,
    emailVerified: this.emailVerified,
    provider: this.provider,
    preferences: this.preferences,
    role: this.role,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin,
  };
};

// Static methods
userSchema.statics.findByUid = function (uid) {
  return this.findOne({ uid });
};

userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Pre-save middleware
userSchema.pre("save", function (next) {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
