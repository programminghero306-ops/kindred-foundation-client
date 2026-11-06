# Kindred Foundation — Web

The frontend for the Kindred Foundation community events platform. Built with
React 19 + Vite.

## Features

- Home page with upcoming events, hero section, and calls to action
- Browse all upcoming events with search and type filters
- Event details with join, edit, and delete actions
- Register and log in with JWT authentication
- Create and edit events
- "My events" dashboard for events you host
- "Joined events" page for events you signed up for
- Donation pledge area and volunteer opportunities
- Responsive layout for desktop, tablet, and mobile

## Live links

- Frontend: https://kindred-foundation.vercel.app
- Backend: https://kindread-foundation-server.onrender.com
- Backend health: https://kindread-foundation-server.onrender.com/health

## Requirements

- Node.js 18 or newer
- The Kindred Foundation API running at `http://localhost:5000`

## Setup

### 1. Start the backend first

Open a terminal in the API project:

```powershell
cd C:\projects\kindread-foundation-server
npm run dev
```

Wait until you see `Connected to MongoDB` and `Server running on port 5000`.

### 2. Start the frontend

Open a second terminal:

```powershell
cd C:\projects\kiundre-foundation\kindred-web
npm install
npm run dev
```

Open the URL Vite prints, usually:

```text
http://localhost:5173
```

## API URL

The app uses `http://localhost:5000` by default.

To change it, create a `.env` file in this folder:

```env
VITE_API_URL=http://localhost:5000
```

`.env` is ignored by git. A `.env.example` file is included for reference.

For production, set `VITE_API_URL` to your deployed API URL before running
`npm run build`.

## Pages

| Route | Description |
| --- | --- |
| `/` | Home with the six nearest upcoming events |
| `/events` | All upcoming events with search and filters |
| `/events/:id` | Event details, join button, host controls |
| `/login` | Log in |
| `/register` | Create an account |
| `/create-event` | Create an event (requires login) |
| `/events/:id/edit` | Edit your event (requires login) |
| `/my-events` | Events you created (requires login) |
| `/joined-events` | Events you joined (requires login) |

## How authentication works

1. Register or log in to receive a JWT from the API.
2. The token and user are stored in `localStorage`.
3. Protected API requests send `Authorization: Bearer <token>`.
4. The API checks that the token email matches the email in the request.
5. Tokens expire after 7 days; the app clears the session and asks you to log
   in again.

## Build for production

```powershell
npm run build
npm run preview
```

The production files are written to `dist/`.

## Useful scripts

```powershell
npm run dev      # start the development server
npm run build    # build for production
npm run preview  # preview the production build
npm run lint     # check code quality
```

## Troubleshooting

### "Cannot reach the server"

The backend is not running, or `VITE_API_URL` is wrong. Start the API on port
5000 and refresh.

### 401 or "Invalid or expired token"

Log out and log in again. If you changed `JWT_SECRET` on the server, all old
tokens are invalid.

### 403 "Token email does not match the requested email"

Make sure the email used to log in matches the email being requested. The app
takes it from the logged-in user, so this usually means the session is stale.

### Images do not load

Thumbnails are optional external URLs. Broken links fall back to a built-in
placeholder.

### The page looks unstyled

Make sure you are running `npm run dev` from the `kindred-web` folder, not from
the API folder.
