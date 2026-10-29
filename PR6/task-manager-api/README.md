# Full-Stack Task Manager API

Express and Mongoose API used by the React/Vite Practical 6 frontend.

## Configure and run

1. Start MongoDB locally or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env` and set `MONGO_URI` to your database URI.
3. Keep `.env` private; it is excluded by `.gitignore`.
4. Install and start the backend:

```sh
npm install
npm start
```

The API listens on `http://localhost:5000`. `CLIENT_ORIGIN` controls which frontend origin can call the API; it defaults to `http://localhost:5173`.

## API routes

- `GET /tasks` lists tasks.
- `GET /tasks/:id` returns one task.
- `POST /tasks` creates a task.
- `PUT /tasks/:id` updates a task.
- `DELETE /tasks/:id` deletes a task.

Task fields are `title`, `description`, `completed`, and `priority` (`low`, `medium`, or `high`).
