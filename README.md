# Worship Songs Tool

A browser-based worship practice tool for managing song setlists, practicing with YouTube playback, and applying real-time pitch shifting via a Chrome extension.

## Features

- **Song Management** — Add, edit, and remove songs with title, YouTube link, original key, target key, service date, and score URL
- **Setlist View** — Songs grouped by service date in the sidebar
- **YouTube Player** — Embedded playback with speed control (0.5×, 0.75×, 1×, 1.25×)
- **Pitch Shifting** — Chrome extension automatically shifts the YouTube audio to the target key
- **Score Panel** — Display sheet music from Google Docs/Drive alongside the video
- **Google Sign-In** — Link your Google account to auto-authenticate score URLs

## Live Demo

**https://tingyi-chang.github.io/worship-songs-tool/**

## Getting Started

1. Visit the live demo above, or open `index.html` locally in your browser
2. Click **Manage songs** to go to the admin page and add songs
3. *(Optional)* Install the Chrome extension from the `/extension` folder for pitch shifting support
4. Select a song from the sidebar to start practicing

### Installing the Chrome Extension

1. Go to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `/extension` folder

## Tech Stack

- Vanilla HTML / CSS / JavaScript
- YouTube IFrame API
- [Tone.js](https://tonejs.github.io/) (pitch shifting in extension)
- Google Identity Services (OAuth)
- `localStorage` for song data persistence

---

## TODO

### Core Features
- [ ] **Cloud sync** — Replace `localStorage` with a backend or Google Sheets so data persists across devices and browsers
- [ ] **Import / Export** — Export song list as JSON or CSV for backup; import from a file
- [ ] **Share setlist** — Generate a shareable URL or QR code for a service setlist so the whole team can load the same songs

### Practice Tools
- [ ] **Loop section** — Mark a start/end timestamp on the YouTube video and loop that section for focused practice
- [ ] **Metronome** — Built-in tap-tempo metronome synced to the current song's BPM
- [ ] **Capo helper** — For guitar players, display the capo position needed to play in the target key using open shapes

### Song Management
- [ ] **Search & filter** — Filter the sidebar by song title, key, or date
- [ ] **Tags / categories** — Label songs by tempo, mood, or genre for quick filtering
- [ ] **Practice notes** — Add per-song notes (e.g., "start slow", "check bridge") visible during practice
- [ ] **Duplicate song** — Clone an existing song entry as a starting point for a new arrangement

### UI / UX
- [ ] **Mobile layout** — Improve responsiveness for phone/tablet use during rehearsal
- [ ] **Dark / light mode** — Toggle between themes
- [ ] **Keyboard shortcuts** — Arrow keys to switch songs, space to play/pause

### Multi-user / Team
- [ ] **Role-based access** — Separate read-only (musician) and edit (worship leader) views without exposing the admin page
- [ ] **Multiple instrument keys** — Set different target keys per instrument (e.g., Bb for trumpet, Eb for alto sax)
