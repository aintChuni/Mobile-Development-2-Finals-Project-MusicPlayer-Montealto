# 🎵 Music Player / Audio Streamer App

**Final Project for SPElec2B**

This Ionic + Capacitor app allows users to play music from local storage or stream from online music services like Spotify. It features playlist management, custom playback controls, metadata display, and a smooth user interface optimized for Android.

## 📱 Features

### 🎧 Local Audio Playback
- Scan and play audio files from device storage
- Supported audio formats:
  - `.mp3` (MP3)
  - `.m4a`, `.aac` (AAC)
  - `.wav` (WAV)
  - `.ogg` (Ogg Vorbis)
  - `.flac` (FLAC)
  - `.opus` (Opus)
- Display extracted metadata such as song title, artist, and cover art (if available)
- Add songs to local playlists with offline persistence

### 🌐 Online Music Streaming
- Integrates with Spotify Web API to fetch and stream music
- Displays album artwork and metadata from the Spotify service
- Stream track full-length playback (with Spotify Premium)
- Playlist and playback state management
- Ability to play/pause songs directly in playlist view

### 💾 Persistent Storage
- Local playlists stored using Ionic Storage
- Automatically loads saved data on app startup

### 🎨 UI & UX
- Custom-designed splash screen and app icon
- Responsive layout optimized for Android devices
- Supports play/pause buttons, song highlight, and seek (where available)

## 📂 Project Structure (Key Pages)

- `tab1`: Spotify streaming and full-screen player
- `tab2`: Playlist manager for Spotify and local songs
- `local-player.page`: Displays and plays audio from device storage
- `fullscreen-player.page`: Optional fullscreen UI for detailed control
- `audio.service.ts`: Centralized service for managing audio playback
- `spotify.service.ts`: Manages Spotify authentication and API calls
