// server/models/Favorite.js
import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    // User identification
    userUid: {
      type: String,
      required: true,
      index: true,
    },

    // Item identification
    itemId: {
      type: Number,
      required: true,
    },

    // Item details
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["anime", "manga", "character"],
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    // Additional metadata
    genres: [
      {
        mal_id: Number,
        type: String,
        name: String,
        url: String,
      },
    ],

    score: {
      type: Number,
      min: 0,
      max: 10,
    },

    status: {
      type: String,
      trim: true,
    },

    // Type-specific fields
    episodes: {
      type: Number,
      min: 0,
    },

    chapters: {
      type: Number,
      min: 0,
    },

    volumes: {
      type: Number,
      min: 0,
    },

    // User notes and rating
    userNotes: {
      type: String,
      maxlength: 1000,
      trim: true,
      default: "",
    },

    userRating: {
      type: Number,
      min: 1,
      max: 10,
    },

    // Tags for organization
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],

    // Metadata
    addedAt: {
      type: Date,
      default: Date.now,
    },

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound indexes for efficient queries
favoriteSchema.index({ userUid: 1, addedAt: -1 });
favoriteSchema.index({ userUid: 1, type: 1, addedAt: -1 });
favoriteSchema.index({ userUid: 1, itemId: 1, type: 1 }, { unique: true });

// Static methods
favoriteSchema.statics.findUserFavorites = function (
  userUid,
  type = null,
  options = {}
) {
  const query = { userUid };
  if (type) query.type = type;

  return this.find(query)
    .sort({ addedAt: -1 })
    .limit(options.limit || 100)
    .skip(options.skip || 0);
};

favoriteSchema.statics.findUserFavorite = function (userUid, itemId, type) {
  return this.findOne({ userUid, itemId, type });
};

favoriteSchema.statics.removeUserFavorite = function (userUid, itemId, type) {
  return this.deleteOne({ userUid, itemId, type });
};

favoriteSchema.statics.getUserStats = function (userUid) {
  return this.aggregate([
    { $match: { userUid } },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        avgUserRating: { $avg: "$userRating" },
        avgScore: { $avg: "$score" },
      },
    },
  ]);
};

// Instance methods
favoriteSchema.methods.updateMetadata = function (data) {
  if (data.userRating) this.userRating = data.userRating;
  if (data.userNotes) this.userNotes = data.userNotes;
  if (data.tags) this.tags = data.tags;
  this.lastUpdated = new Date();
  return this.save();
};

// Pre-save middleware
favoriteSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
