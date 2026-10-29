# Practical 6 — Full-Stack Task Manager

This React + Vite portfolio connects its **Tasks** page (`/projects`) to the Express + MongoDB API in `../task-manager-api`. The home page portfolio and React Router navigation remain available.

## Configure MongoDB and CORS

1. In `../task-manager-api`, copy `.env.example` to `.env` if one does not already exist.
2. Set `MONGO_URI` to your local MongoDB URI or MongoDB Atlas URI. Keep `.env` private; it is ignored by Git.
3. Set `PORT=5000` and `CLIENT_ORIGIN=http://localhost:5173` in that backend `.env`.
4. The frontend uses `http://localhost:5000` by default. To use another API URL, create a frontend `.env` with `VITE_API_URL=http://your-api-host:port` and allow the matching frontend origin in the backend `CLIENT_ORIGIN` value.

## Start both servers

Open two terminals from the PR6 folder.

Terminal 1 — backend:

```sh
cd task-manager-api
npm install
npm start
```

Terminal 2 — frontend:

```sh
cd student-portfolio
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`, and select **Tasks** in the navigation.

## Use the task manager

Create a task with a title, optional description, completion state, and priority. Use **View details** to load one task by ID, **Edit** to update it, **Mark done/active** to change completion, and **Delete** to remove it after confirmation. Success and error messages appear as toasts. The list updates after successful changes and tasks remain stored in MongoDB after a browser refresh.

### Local port note

This Mac has system services using ports `5000` and `5001`. The ignored local backend `.env` uses `PORT=5002`, and the ignored frontend `.env.local` points `VITE_API_URL` to `http://localhost:5002`. On a machine where port 5000 is free, use the sample backend setting (`PORT=5000`) and the frontend default (`http://localhost:5000`) instead.
