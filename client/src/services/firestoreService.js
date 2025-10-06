// src/services/firestoreService.js
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebaseClient";

// Collection names
const COLLECTIONS = {
  FAVORITES: "favorites",
  WATCHLIST: "watchlist",
};

// Helper function to create document ID
const createDocId = (userId, itemId, type) => `${userId}_${type}_${itemId}`;

// **FAVORITES FUNCTIONS**

export const addToFavorites = async (userId, item) => {
  try {
    const docId = createDocId(userId, item.mal_id, item.type);
    const favoriteData = {
      userId,
      itemId: item.mal_id,
      type: item.type, // 'anime', 'manga', 'character'
      title: item.title || item.name,
      image:
        item.images?.jpg?.image_url || item.images?.jpg?.large_image_url || "",
      genres: item.genres || [],
      score: item.score || null,
      status: item.status || "",
      episodes: item.episodes || null,
      chapters: item.chapters || null,
      volumes: item.volumes || null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(doc(db, COLLECTIONS.FAVORITES, docId), favoriteData);
    return { success: true, data: favoriteData };
  } catch (error) {
    console.error("Error adding to favorites:", error);
    return { success: false, error: error.message };
  }
};

export const removeFromFavorites = async (userId, itemId, type) => {
  try {
    const docId = createDocId(userId, itemId, type);
    await deleteDoc(doc(db, COLLECTIONS.FAVORITES, docId));
    return { success: true };
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return { success: false, error: error.message };
  }
};

export const getFavorites = async (userId, type = null) => {
  try {
    let q;
    if (type) {
      q = query(
        collection(db, COLLECTIONS.FAVORITES),
        where("userId", "==", userId),
        where("type", "==", type),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, COLLECTIONS.FAVORITES),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    const favorites = [];
    querySnapshot.forEach((doc) => {
      favorites.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: favorites };
  } catch (error) {
    console.error("Error getting favorites:", error);
    return { success: false, error: error.message };
  }
};

export const checkIfFavorite = async (userId, itemId, type) => {
  try {
    const favorites = await getFavorites(userId, type);

    if (favorites.success) {
      const isFavorite = favorites.data.some((fav) => fav.itemId === itemId);
      return { success: true, isFavorite };
    }

    return { success: false, isFavorite: false };
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return { success: false, isFavorite: false };
  }
};

// **WATCHLIST FUNCTIONS**

export const addToWatchlist = async (
  userId,
  item,
  status = "plan_to_watch"
) => {
  try {
    const docId = createDocId(userId, item.mal_id, item.type);
    const watchlistData = {
      userId,
      itemId: item.mal_id,
      type: item.type, // 'anime', 'manga'
      title: item.title,
      image:
        item.images?.jpg?.image_url || item.images?.jpg?.large_image_url || "",
      genres: item.genres || [],
      score: item.score || null,
      status: item.status || "",
      episodes: item.episodes || null,
      chapters: item.chapters || null,
      volumes: item.volumes || null,
      watchStatus: status, // 'watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'
      userScore: null, // User's personal rating
      progress: 0, // Episodes/chapters watched/read
      notes: "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(doc(db, COLLECTIONS.WATCHLIST, docId), watchlistData);
    return { success: true, data: watchlistData };
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return { success: false, error: error.message };
  }
};

export const removeFromWatchlist = async (userId, itemId, type) => {
  try {
    const docId = createDocId(userId, itemId, type);
    await deleteDoc(doc(db, COLLECTIONS.WATCHLIST, docId));
    return { success: true };
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return { success: false, error: error.message };
  }
};

export const updateWatchlistItem = async (userId, itemId, type, updates) => {
  try {
    const docId = createDocId(userId, itemId, type);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    await setDoc(doc(db, COLLECTIONS.WATCHLIST, docId), updateData, {
      merge: true,
    });
    return { success: true, data: updateData };
  } catch (error) {
    console.error("Error updating watchlist item:", error);
    return { success: false, error: error.message };
  }
};

export const getWatchlist = async (userId, type = null, watchStatus = null) => {
  try {
    let q;
    const conditions = [where("userId", "==", userId)];

    if (type) {
      conditions.push(where("type", "==", type));
    }

    if (watchStatus) {
      conditions.push(where("watchStatus", "==", watchStatus));
    }

    q = query(
      collection(db, COLLECTIONS.WATCHLIST),
      ...conditions,
      orderBy("updatedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const watchlist = [];
    querySnapshot.forEach((doc) => {
      watchlist.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, data: watchlist };
  } catch (error) {
    console.error("Error getting watchlist:", error);
    return { success: false, error: error.message };
  }
};

export const checkIfInWatchlist = async (userId, itemId, type) => {
  try {
    const watchlist = await getWatchlist(userId, type);

    if (watchlist.success) {
      const watchlistItem = watchlist.data.find(
        (item) => item.itemId === itemId
      );
      return {
        success: true,
        inWatchlist: !!watchlistItem,
        watchlistData: watchlistItem || null,
      };
    }

    return { success: false, inWatchlist: false, watchlistData: null };
  } catch (error) {
    console.error("Error checking watchlist status:", error);
    return { success: false, inWatchlist: false, watchlistData: null };
  }
};

// **UTILITY FUNCTIONS**

export const getUserStats = async (userId) => {
  try {
    const [favorites, watchlist] = await Promise.all([
      getFavorites(userId),
      getWatchlist(userId),
    ]);

    if (favorites.success && watchlist.success) {
      const stats = {
        totalFavorites: favorites.data.length,
        favoriteAnime: favorites.data.filter((item) => item.type === "anime")
          .length,
        favoriteManga: favorites.data.filter((item) => item.type === "manga")
          .length,
        favoriteCharacters: favorites.data.filter(
          (item) => item.type === "character"
        ).length,
        totalWatchlist: watchlist.data.length,
        watching: watchlist.data.filter(
          (item) => item.watchStatus === "watching"
        ).length,
        completed: watchlist.data.filter(
          (item) => item.watchStatus === "completed"
        ).length,
        planToWatch: watchlist.data.filter(
          (item) => item.watchStatus === "plan_to_watch"
        ).length,
        onHold: watchlist.data.filter((item) => item.watchStatus === "on_hold")
          .length,
        dropped: watchlist.data.filter((item) => item.watchStatus === "dropped")
          .length,
      };

      return { success: true, data: stats };
    }

    return { success: false, error: "Failed to fetch user data" };
  } catch (error) {
    console.error("Error getting user stats:", error);
    return { success: false, error: error.message };
  }
};

// Export watch status options for UI components
export const WATCH_STATUS_OPTIONS = [
  { value: "watching", label: "Watching", color: "bg-green-500" },
  { value: "completed", label: "Completed", color: "bg-blue-500" },
  { value: "on_hold", label: "On Hold", color: "bg-yellow-500" },
  { value: "dropped", label: "Dropped", color: "bg-red-500" },
  { value: "plan_to_watch", label: "Plan to Watch", color: "bg-purple-500" },
];
