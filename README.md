# Chat2Chat

A real-time 1:1 chat app built with Next.js (App Router), Tailwind CSS + daisyUI, and Firebase (Authentication, Firestore, Storage).

## Features

- **Email/password auth** — register and login with Firebase Authentication.
- **Randomly generated avatars** on registration, refreshable before signup.
- **User directory** — browse other registered users and start a new chat with one click.
- **Real-time messaging** — messages sync instantly across clients via Firestore's `onSnapshot`.
- **Image sharing** — attach an image to a message, uploaded to Firebase Storage.
- **Emoji picker** for composing messages.
- **Chatroom list** with the last message preview, alongside the user directory, in a tabbed sidebar.
- Custom daisyUI theme built around the app's navy/orange brand colors.

## Tech stack

| Layer      | Technology |
|------------|------------|
| Framework  | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI         | [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com), [daisyUI v5](https://daisyui.com) |
| Backend    | [Firebase](https://firebase.google.com) — Authentication, Firestore, Storage |
| Other libs | `emoji-picker-react`, `random-avatar-generator`, `react-hot-toast`, `react-icons`, `moment` |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

Create a Firebase project with **Authentication** (Email/Password provider), **Firestore**, and **Storage** enabled, then copy your web app config into a `.env` file at the project root (see `.env.example`):

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). New users land on `/register`; existing users use `/login`.

## Project structure

```
app/
├── layout.js              # Root layout, fonts, toaster
├── page.js                # Home: sidebar + chat window
├── globals.css            # Tailwind import + custom daisyUI theme
├── login/page.js          # Login form
├── register/page.js       # Registration form + avatar picker
└── components/
    ├── Users.js           # Sidebar: user directory + chatroom list, tabs, logout
    ├── UserCard.js         # Row for a user or chatroom preview
    ├── ChatRoom.js         # Message list, header, auto-scroll, send logic
    ├── MessageCard.js      # A single chat bubble (daisyUI chat classes)
    └── MessageInput.js     # Text input, emoji picker, image upload modal

lib/
└── firebase.js            # Firebase app/auth/firestore initialization
```

## Data model (Firestore)

- **`users/{uid}`** — `name`, `email`, `avatarUrl`.
- **`chatrooms/{id}`** — `users: [uid, uid]`, `usersData` (map of uid → user snapshot), `lastMessage`, `timestamp`.
- **`messages/{id}`** — `chatroomId`, `sender` (uid), `content`, `image` (optional Storage URL), `time` (server timestamp).

## Available scripts

- `npm run dev` — start the dev server (Turbopack).
- `npm run build` — production build.
- `npm run start` — run the production build.
- `npm run lint` — run ESLint.
