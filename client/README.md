# 🎌 Otaku World - Client

A modern React-based anime discovery platform built with Vite, featuring real-time anime data from Jikan API.

## ✨ Features

- 🔍 **Anime Search**: Real-time search with debounced input
- 📺 **Browse Top Anime**: Discover highly-rated anime series and movies
- 🔥 **Trending Section**: Stay updated with currently airing anime
- 📖 **Detailed Views**: Comprehensive anime information pages
- ❤️ **Favorites System**: Save and organize your favorite anime (coming soon)
- 🔐 **Authentication**: Google OAuth integration
- 📱 **Responsive Design**: Works seamlessly on all devices

## 🚀 Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **API**: Jikan API v4 (MyAnimeList unofficial API)
- **Routing**: React Router DOM
- **State Management**: React hooks

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
