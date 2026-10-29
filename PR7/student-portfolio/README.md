# Practical 7 — Authenticated Task Manager

The React/Vite portfolio includes a private task manager at `/projects`, backed by the Express/Mongoose API in `../task-manager-api`. Accounts use bcrypt password hashes, and task access requires a one-hour JWT.

## Configure the backend

1. Start MongoDB locally or create a MongoDB Atlas database.
2. In `../task-manager-api`, copy `.env.example` to `.env` if needed.
3. Set `MONGO_URI` and a strong random `JWT_SECRET` (for example, generate one with `openssl rand -hex 32`). Keep `.env` private; Git ignores it.
4. Set `PORT` and `CLIENT_ORIGIN` to match your local setup. The frontend origin defaults to `http://localhost:5173`.

## Start both servers

Terminal 1 — API:

```sh
cd task-manager-api
npm install
npm start
```

Terminal 2 — React app:

```sh
cd student-portfolio
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`. This local PR7 copy uses the ignored `.env.local` API URL override for port `5002`; the frontend default is `http://localhost:5000`.

## Try it

Create an account from **Sign in → Create an account**, then sign in. The JWT is stored in browser local storage and sent as `Authorization: Bearer <token>`. The `/me` endpoint checks the active session on reload. Use the Tasks page to create, view, update, complete, and delete your own tasks. Sign out to clear the token. Invalid or expired sessions are cleared and redirect protected pages to login.

For a fresh checkout using the example backend port `5002`, create `student-portfolio/.env.local` with `VITE_API_URL=http://localhost:5002`. This file is ignored by Git. If you set the backend `PORT=5000`, the frontend default already matches and no frontend environment file is needed.
