# SoundCloud Desktop Clone

A desktop application that mimics SoundCloud functionality using Electron and React. It uses SoundCloud's public API for fetching tracks, playlists, and user data.

## Features

- Search and play tracks
- View playlists and user profiles
- Local storage for favorites
- Media player with controls

## Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`

## API Usage

Uses SoundCloud public client ID for API requests. Replace `YOUR_PUBLIC_CLIENT_ID` in the code with your actual client ID.

## Technologies

- Electron
- React
- Axios for API calls
- Howler.js for audio playback
- SQLite for local storage