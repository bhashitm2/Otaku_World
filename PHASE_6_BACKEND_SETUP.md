# Phase 6 Backend Integration Setup Instructions

## 🚀 Server Setup & Installation

### 1. Install Backend Dependencies

Navigate to the server directory and install all required packages:

```bash
cd server
npm install
```

### 2. Environment Configuration

The server `.env` file is already configured with the following settings:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/otaku_world

# Firebase Admin SDK
FIREBASE_PROJECT_ID=otaku-world-anime-portal
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@otaku-world-anime-portal.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Server Configuration
PORT=5000
NODE_ENV=development

# API Configuration
JIKAN_BASE_URL=https://api.jikan.moe/v4
JIKAN_RATE_LIMIT=1500

# Cache Configuration
CACHE_TTL=300
CACHE_MAX_KEYS=1000
```

### 3. MongoDB Setup

**Option A: Local MongoDB Installation**

```bash
# Install MongoDB locally
# Windows: Download MongoDB Community Server
# macOS: brew install mongodb-community
# Ubuntu: sudo apt install mongodb

# Start MongoDB service
mongod --dbpath ./data/db
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Update `MONGODB_URI` in `.env` with your Atlas connection string

### 4. Firebase Admin SDK Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `otaku-world-anime-portal`
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Update the Firebase credentials in `.env` with your service account details

### 5. Start the Backend Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000` with the following endpoints:

- **Health Check**: `GET /health`
- **API Documentation**: `GET /api`
- **Cache Statistics**: `GET /api/cache/stats`

## 🔧 Frontend Integration

### Update Client Environment

Add the backend URL to your client `.env` file:

```env
# Client environment (.env in client folder)
VITE_API_URL=http://localhost:5000/api
```

### API Service Integration

The client is now configured to use the backend API with the enhanced `apiService` object:

```javascript
import { apiService } from "../services/api.js";

// Examples:
const trendingAnime = await apiService.anime.getTrending();
const userFavorites = await apiService.favorites.get();
const userStats = await apiService.users.getStats();
```

## 📊 Backend Features

### ✅ Implemented Features

1. **Firebase Admin SDK Integration**

   - Token verification and user authentication
   - Automatic user sync between Firebase and MongoDB

2. **Advanced API Caching**

   - NodeCache implementation with configurable TTL
   - Cache statistics and monitoring
   - Intelligent cache invalidation

3. **Enhanced Jikan API Integration**

   - Request queue with rate limiting (1.5s intervals)
   - Retry logic and error handling
   - Comprehensive anime/manga/character endpoints

4. **Database Management**

   - MongoDB with Mongoose ODM
   - Optimized schemas with proper indexing
   - User, Favorite, and Watchlist models

5. **Security & Performance**

   - Helmet security middleware
   - CORS configuration
   - Rate limiting per user and endpoint
   - Request compression and logging

6. **User Management**
   - Role-based authorization
   - User preferences and activity tracking
   - Account management endpoints

## 🧪 Testing the Backend

### Health Check

```bash
curl http://localhost:5000/health
```

### API Documentation

```bash
curl http://localhost:5000/api
```

### Cache Statistics

```bash
curl http://localhost:5000/api/cache/stats
```

### Test Authentication (with Firebase token)

```bash
curl -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
     http://localhost:5000/api/auth/verify
```

## 🔄 Next Steps

1. **Start the servers**:

   ```bash
   # Terminal 1: Start backend
   cd server && npm run dev

   # Terminal 2: Start frontend
   cd client && npm run dev
   ```

2. **Verify integration**:

   - Frontend should connect to backend automatically
   - Check browser network tab for API calls to localhost:5000

3. **Monitor performance**:
   - Watch cache hit rates in `/api/cache/stats`
   - Monitor response times and rate limiting

The Phase 6 backend integration is now complete! 🎉
