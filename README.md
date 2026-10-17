# SocialApp

A React social media frontend for sharing posts, commenting, and managing your profile. Built with Vite and connected to the Route Posts API (`route-posts.routemisr.com`).

## Features

- **Auth** — Register and login with form validation (React Hook Form + Zod)
- **Protected routes** — Logged-in users see Home / Profile; guests stay on auth pages
- **Feed** — Browse posts sorted by newest, create posts with text and images
- **Engagement** — Like posts, add comments and replies, edit or delete your own content
- **Post details** — Open a single post with its full comment thread
- **Profile** — View your posts, upload a profile photo, and change password

## Tech stack

| Area | Library |
|------|---------|
| UI | React 19, HeroUI, Tailwind CSS 4 |
| Routing | React Router DOM |
| Data fetching | TanStack Query, Axios |
| Forms / validation | React Hook Form, Zod |
| Feedback | React Toastify, SweetAlert2 |
| Build | Vite 8 |

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build    # production build
npm run preview  # preview production build
npm run lint     # ESLint
```

Open the local URL shown in the terminal (usually `http://localhost:5173`).

## App routes

| Path | Description |
|------|-------------|
| `/` | Login |
| `/register` | Sign up |
| `/home` | Main feed (auth required) |
| `/profile` | User profile (auth required) |
| `/postDetailes/:id` | Post details (auth required) |

## API

All requests go to:

```
https://route-posts.routemisr.com
```

Authenticated calls send a Bearer token stored in `localStorage` under `token`.

## Project structure

```
src/
  Auth/           # Login & Register
  Components/     # Home, Profile, posts, comments, layout, navbar
  Context/        # Auth context (token + user data)
  CreatePostCard/ # Create post UI
  CreateCommentCard/
  CreateReplyCard/
  ProtectAuth/    # Redirect logged-in users away from auth pages
  ProtectRouter/  # Guard private pages
  schemas/        # Zod schemas
```

## Notes

This is a frontend client for the Route Academy social posts API. You need a valid account on that API to sign in and use the app.
