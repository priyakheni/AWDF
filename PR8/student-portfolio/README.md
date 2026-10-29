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

## Practical 8 — Lazy loading and bundle comparison

The production build was measured before and after adding `React.lazy()` and `Suspense`. Vite's gzip column is its compressed-size estimate.

| Build output | Before | After |
| --- | ---: | ---: |
| Main JavaScript entry | 291.64 kB (90.56 kB gzip) | 278.70 kB (87.88 kB gzip) |
| Projects lazy chunk | Included in main bundle | 1.96 kB (0.67 kB gzip) |
| Contact lazy chunk | Included in main bundle | 3.59 kB (1.32 kB gzip) |
| Authenticated Tasks lazy chunk | Included in main bundle | 10.00 kB (3.07 kB gzip) |
| Total JavaScript across all output chunks | 291.64 kB (90.56 kB gzip) | 294.25 kB (92.94 kB gzip) |

The entry bundle decreased by 12.94 kB raw and 2.68 kB gzip. Splitting adds a small amount of total bundle overhead: all after-build chunks together are 2.61 kB raw and 2.38 kB gzip larger than the single baseline bundle. On the home page, Projects and Contact are also rendered, so their lazy chunks are requested there; the authenticated Tasks chunk waits until a signed-in user opens `/projects`.

Build commands:

```sh
npm run build
```

Vite prints raw and gzip sizes and writes separate `Projects-*.js`, `Contact-*.js`, and `Tasks-*.js` chunks under `dist/assets`.

### Capture a Chrome DevTools Network comparison

1. Start the frontend and backend, sign in, and open the app in Chrome.
2. Open **DevTools → Network**, enable **Disable cache**, select **Slow 3G** in the throttling menu, and filter by **JS**.
3. Hard-reload the home page. Record the JavaScript filenames, **Transferred** sizes, and load timings. The home page renders Projects and Contact, so those chunks are requested as their sections render.
4. Navigate to `/projects` while signed in. Record the `Tasks-*.js` request and timing. Navigate to `/contact` in a fresh tab or after clearing the Network log/cache to see its `Contact-*.js` request.
5. Capture screenshots showing the throttling selection, JS filter, chunk filenames, transferred sizes, and waterfall. For a baseline screenshot, repeat from the Practical 7 copy before lazy loading; the baseline build measurements above are from that build.
6. Include the actual Chrome values in the report. Chrome's transferred sizes and timings can differ from Vite's gzip estimates because browser caching, compression, and request timing affect them.
