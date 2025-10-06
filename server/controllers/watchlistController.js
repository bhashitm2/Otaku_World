// server/controllers/watchlistController.js
import Watchlist from "../models/Watchlist.js";

// Get user's watchlist
export const getWatchlist = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 50 } = req.query;
    const userUid = req.user.uid;

    const options = {
      limit: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    };

    const watchlist = await Watchlist.findUserWatchlist(
      userUid,
      { status, type },
      options
    );
    const total = await Watchlist.countDocuments({
      userUid,
      ...(status && { watchStatus: status }),
      ...(type && { type }),
    });

    const stats = await Watchlist.getUserStats(userUid);

    res.json({
      success: true,
      data: watchlist,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
      stats: stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch watchlist",
      error: error.message,
    });
  }
};

// Add to watchlist
export const addToWatchlist = async (req, res) => {
  try {
    const {
      itemId,
      title,
      type,
      image,
      genres,
      score,
      episodes,
      chapters,
      volumes,
      watchStatus,
      progress,
      userNotes,
      userRating,
      tags,
    } = req.body;

    const userUid = req.user.uid;

    if (!itemId || !title || !type) {
      return res.status(400).json({
        success: false,
        message: "Item ID, title, and type are required",
      });
    }

    // Check if already in watchlist
    const existingWatchlist = await Watchlist.findUserWatchlistItem(
      userUid,
      itemId,
      type
    );

    if (existingWatchlist) {
      return res.status(409).json({
        success: false,
        message: "Item already in watchlist",
      });
    }

    const watchlistItem = new Watchlist({
      userUid,
      itemId,
      title,
      type,
      image: image || "",
      genres: genres || [],
      score,
      episodes,
      chapters,
      volumes,
      watchStatus: watchStatus || "planning",
      progress: {
        episodesWatched: progress?.episodesWatched || 0,
        chaptersRead: progress?.chaptersRead || 0,
        volumesRead: progress?.volumesRead || 0,
        lastUpdated: new Date(),
      },
      userNotes: userNotes || "",
      userRating,
      tags: tags || [],
    });

    await watchlistItem.save();

    res.status(201).json({
      success: true,
      message: "Added to watchlist successfully",
      data: watchlistItem,
    });
  } catch (error) {
    console.error("Error adding to watchlist:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Item already in watchlist",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add to watchlist",
      error: error.message,
    });
  }
};

// Remove from watchlist
export const removeFromWatchlist = async (req, res) => {
  try {
    const { itemId, type } = req.params;
    const userUid = req.user.uid;

    if (!itemId || !type) {
      return res.status(400).json({
        success: false,
        message: "Item ID and type are required",
      });
    }

    const result = await Watchlist.removeUserWatchlistItem(
      userUid,
      parseInt(itemId),
      type
    );

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Watchlist item not found",
      });
    }

    res.json({
      success: true,
      message: "Removed from watchlist successfully",
    });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove from watchlist",
      error: error.message,
    });
  }
};

// Update watchlist item
export const updateWatchlist = async (req, res) => {
  try {
    const { itemId, type } = req.params;
    const { watchStatus, progress, userNotes, userRating, tags } = req.body;
    const userUid = req.user.uid;

    const watchlistItem = await Watchlist.findUserWatchlistItem(
      userUid,
      parseInt(itemId),
      type
    );

    if (!watchlistItem) {
      return res.status(404).json({
        success: false,
        message: "Watchlist item not found",
      });
    }

    await watchlistItem.updateProgress({
      watchStatus,
      progress,
      userNotes,
      userRating,
      tags,
    });

    res.json({
      success: true,
      message: "Watchlist updated successfully",
      data: watchlistItem,
    });
  } catch (error) {
    console.error("Error updating watchlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update watchlist",
      error: error.message,
    });
  }
};

// Check if item is in watchlist
export const checkWatchlist = async (req, res) => {
  try {
    const { itemId, type } = req.params;
    const userUid = req.user.uid;

    const watchlistItem = await Watchlist.findUserWatchlistItem(
      userUid,
      parseInt(itemId),
      type
    );

    res.json({
      success: true,
      inWatchlist: !!watchlistItem,
      data: watchlistItem || null,
    });
  } catch (error) {
    console.error("Error checking watchlist:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check watchlist status",
      error: error.message,
    });
  }
};
