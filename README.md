# DiMusic— Full-Stack Audio / Music Website


A complete music streaming website with a glassmorphism player UI, a public
listener site, an admin dashboard, and a real REST API backed by MongoDB.

**Stack**
- Frontend: React 18 + Vite + Tailwind CSS + React Router + lucide-react
- Backend: Node.js + Express + REST API
- Database: MongoDB + Mongoose
- Uploads: Multer (audio + images)
- Auth: JWT (admin only)

No copyrighted audio is included. The audio and image folders ship empty
(with a `.gitkeep`) so you can add your own files.

---

## 1. Project structure

```
audio-website/
├── client/            React + Vite frontend
│   ├── public/
│   │   ├── audio/     ← put your own MP3 files here
│   │   └── images/    ← put your own cover/background images here
│   └── src/
│       ├── components/   Navbar, Sidebar, MusicPlayer, SongCard, etc.
│       ├── pages/         Home, Songs, Playlists, Admin*, ...
│       ├── layouts/       MainLayout, AdminLayout
│       ├── context/       AuthContext, PlayerContext
│       ├── hooks/         useAudioPlayer, useDebounce
│       └── services/      axios API clients
│
├── server/            Express + MongoDB backend
│   ├── controllers/
│   ├── models/         User, Song, Playlist
│   ├── routes/
│   ├── middleware/     auth (JWT), upload (Multer), errorHandler
│   ├── uploads/         audio/ and images/ (files uploaded via admin panel)
│   ├── server.js
│   └── seed.js          creates the default admin user
│
└── README.md
```

---

## 2. Prerequisites

- Node.js 18+ and npm
- MongoDB running locally (or an Atlas connection string)

---

## 3. Installation

### Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env if needed (Mongo URI, JWT secret, admin credentials)
npm run seed     # creates the default admin user from .env
npm run dev      # starts the API on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev      # starts the site on http://localhost:5173
```

The Vite dev server proxies `/api` and `/uploads` requests to
`http://localhost:5000`, so you don't need to configure CORS URLs manually
for local development (CORS is still enabled server-side via `CLIENT_URL`).

Open `http://localhost:5173` for the public site and
`http://localhost:5173/admin/login` for the admin panel.

---

## 4. Environment variables (`server/.env`)

```
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/audio_website

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change_this_password
```

Never commit a real `.env` file — only `.env.example` is checked in.
Run `npm run seed` any time after changing the admin credentials to
update (or create) that admin account.

---

## 5. Adding your own audio (the easy way)

You don't need to touch any code to add a song.

1. Copy an MP3 into `client/public/audio/`, e.g.
   `client/public/audio/my-song.mp3`
2. Copy a cover/background image into `client/public/images/`, e.g.
   `client/public/images/my-song.jpg`
3. Log in to the admin panel at `/admin/login` → **Songs** → **Add song**
   (or **Upload**), and fill in:
   - Audio path: `/audio/my-song.mp3`
   - Image path: `/images/my-song.jpg`
   - Title / artist / album / description
4. Save. It immediately shows up on the Home and Songs pages — no restart
   required for new audio files, since Vite serves everything in
   `client/public/` as static assets.

Supported audio formats: `.mp3 .wav .ogg .m4a`
Supported image formats: `.jpg .jpeg .png .webp`

### Adding audio via the upload system instead

From the admin **Upload** page you can drag/select an MP3 and image file
directly. They're uploaded through the Express API (via Multer) and stored
in `server/uploads/audio` / `server/uploads/images`, then served at
`/uploads/audio/<file>` and `/uploads/images/<file>`. The song form fills in
those paths automatically after a successful upload — nothing else to
configure.

---

## 6. Backend REST API

Base URL: `http://localhost:5000/api`

**Auth**
```
POST   /auth/login          { email, password } → { token, user }
POST   /auth/logout
GET    /auth/me             (protected)
```

**Songs**
```
GET    /songs                ?search=&featured=true&sort=popular|recent
GET    /songs/:id
POST   /songs                (admin)
PUT    /songs/:id            (admin)
DELETE /songs/:id            (admin)
PATCH  /songs/:id/play       increments play count
```

**Playlists**
```
GET    /playlists
GET    /playlists/:id
POST   /playlists            (admin)
PUT    /playlists/:id        (admin)
DELETE /playlists/:id        (admin)
```

**Uploads** (admin, multipart/form-data)
```
POST   /upload/audio         field name: "audio"
POST   /upload/image         field name: "image"
```

**Statistics** (admin)
```
GET    /stats                total songs / playlists / plays, top songs
```

All admin routes require `Authorization: Bearer <token>`, obtained from
`POST /auth/login`.

---

## 7. Frontend routes

```
/                    Home — hero player, featured/popular/recent, playlists
/songs               Full song library with search
/playlists           All playlists
/playlist/:id        Single playlist with its songs
/admin/login          Admin sign-in
/admin                Admin dashboard (stats)
/admin/songs          Manage songs (create / edit / delete)
/admin/playlists      Manage playlists (create / edit / delete)
/admin/upload          Dedicated upload form
```

---

## 8. Notes

- The player (bottom bar) persists across all public pages and supports
  play/pause, previous/next, shuffle, repeat (off/all/one), seek, volume,
  mute, loading and error states.
- Responsive: the sidebar collapses into a mobile menu, the admin sidebar
  becomes a horizontal scroll bar, and the player bar adapts down to phone
  widths.
- Passwords are hashed with bcrypt; admin routes are protected with JWT +
  role middleware; uploaded file types are validated server-side.
