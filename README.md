# 🌸 Otaku_World

A comprehensive anime portal website built with React frontend and Express backend.

## ✨ Features

- 🔐 **Firebase Authentication** - Google & Twitter OAuth login
- 🎌 **Anime Database** - Powered by Jikan API
- ❤️ **Favorites System** - Save and track your favorite anime
- 🎨 **Modern UI** - Tailwind CSS with anime-themed styling
- 📱 **Responsive Design** - Works on all devices
- 🔍 **Search & Discovery** - Find new anime to watch

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Firebase project

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd otaku-world
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```

3. **Environment Setup**

   Create `.env` files:

   - `client/.env` - Firebase config
   - `.env` - Server config (MongoDB, Firebase Admin)

4. **Start development servers**
   ```bash
   npm run dev
   ```

## 🛠️ Tech Stack

### Frontend

- React 19 + Vite
- Tailwind CSS
- React Router DOM
- Firebase SDK
- Axios

### Backend

- Express.js
- MongoDB + Mongoose
- Firebase Admin SDK
- Passport.js
- Rate Limiting & Security

### APIs

- Jikan API (Anime data)
- Firebase Auth
- Twitter Developer API

## 📱 Screenshots

![Home Page](docs/screenshots/home.png)
![Login Page](docs/screenshots/login.png)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Otaku_World Team** - _Initial work_

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) for providing comprehensive anime data
- [Firebase](https://firebase.google.com/) for authentication services
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
