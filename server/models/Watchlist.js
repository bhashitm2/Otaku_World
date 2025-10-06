// server/models/Watchlist.js
import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
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
      enum: ["anime", "manga"],
      index: true,
    },

    image: {
      type: String,
      default: "",
    },

    // Watch/Read status
    status: {
      type: String,
      required: true,
      enum: ["watching", "completed", "on_hold", "dropped", "plan_to_watch"],
      default: "plan_to_watch",
      index: true,
    },

    // Progress tracking
    progress: {
      type: Number,
      min: 0,
      default: 0,
    },

    totalEpisodes: {
      type: Number,
      min: 0,
    },

    totalChapters: {
      type: Number,
      min: 0,
    },

    totalVolumes: {
      type: Number,
      min: 0,
    },

    // User ratings and notes
    userScore: {
      type: Number,
      min: 1,
      max: 10,
    },

    userNotes: {
      type: String,
      maxlength: 1000,
      trim: true,
      default: "",
    },

    // Dates
    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
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

    malScore: {
      type: Number,
      min: 0,
      max: 10,
    },

    malStatus: {
      type: String,
      trim: true,
    },

    // Tags for organization
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],

    // Priority for planning
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    // Rewatching/Rereading
    isRewatch: {
      type: Boolean,
      default: false,
    },

    rewatchCount: {
      type: Number,
      min: 0,
      default: 0,
    },

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
watchlistSchema.index({ userUid: 1, lastUpdated: -1 });
watchlistSchema.index({ userUid: 1, status: 1, lastUpdated: -1 });
watchlistSchema.index({ userUid: 1, type: 1, lastUpdated: -1 });
watchlistSchema.index({ userUid: 1, itemId: 1, type: 1 }, { unique: true });

// Static methods
watchlistSchema.statics.findUserWatchlist = function (
  userUid,
  filters = {},
  options = {}
) {
  const query = { userUid };

  if (filters.type) query.type = filters.type;
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;

  return this.find(query)
    .sort({ lastUpdated: -1 })
    .limit(options.limit || 100)
    .skip(options.skip || 0);
};

watchlistSchema.statics.findUserWatchlistItem = function (
  userUid,
  itemId,
  type
) {
  return this.findOne({ userUid, itemId, type });
};

watchlistSchema.statics.removeUserWatchlistItem = function (
  userUid,
  itemId,
  type
) {
  return this.deleteOne({ userUid, itemId, type });
};

watchlistSchema.statics.getUserWatchlistStats = function (userUid) {
  return this.aggregate([
    { $match: { userUid } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        avgUserScore: { $avg: "$userScore" },
        avgProgress: { $avg: "$progress" },
        types: { $addToSet: "$type" },
      },
    },
  ]);
};

watchlistSchema.statics.getUserCompletionStats = function (userUid) {
  return this.aggregate([
    { $match: { userUid, status: "completed" } },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        totalEpisodes: { $sum: "$totalEpisodes" },
        totalChapters: { $sum: "$totalChapters" },
        avgScore: { $avg: "$userScore" },
      },
    },
  ]);
};

// Instance methods
watchlistSchema.methods.updateProgress = function (progress, status = null) {
  this.progress = progress;
  if (status) this.status = status;

  // Auto-complete when progress matches total
  if (
    this.type === "anime" &&
    this.totalEpisodes &&
    progress >= this.totalEpisodes
  ) {
    this.status = "completed";
    this.endDate = new Date();
  } else if (
    this.type === "manga" &&
    this.totalChapters &&
    progress >= this.totalChapters
  ) {
    this.status = "completed";
    this.endDate = new Date();
  }

  this.lastUpdated = new Date();
  return this.save();
};

watchlistSchema.methods.updateStatus = function (status) {
  const oldStatus = this.status;
  this.status = status;

  // Set dates based on status changes
  if (status === "watching" && oldStatus === "plan_to_watch") {
    this.startDate = new Date();
  } else if (status === "completed" && oldStatus !== "completed") {
    this.endDate = new Date();
  }

  this.lastUpdated = new Date();
  return this.save();
};

watchlistSchema.methods.updateMetadata = function (data) {
  if (data.userScore) this.userScore = data.userScore;
  if (data.userNotes) this.userNotes = data.userNotes;
  if (data.tags) this.tags = data.tags;
  if (data.priority) this.priority = data.priority;
  this.lastUpdated = new Date();
  return this.save();
};

// Pre-save middleware
watchlistSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

const Watchlist = mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;
