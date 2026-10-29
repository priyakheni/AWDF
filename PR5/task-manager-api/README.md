# Task Manager API — MongoDB Edition

A REST API built with Node.js, Express, and Mongoose. Tasks are stored in MongoDB and remain available after the server restarts.

## Configure MongoDB

1. Start a local MongoDB server, or create a database with MongoDB Atlas.
2. Copy `.env.example` to `.env`.
3. Set `MONGO_URI` in `.env` to your local or Atlas connection string. For local MongoDB, the example value is `mongodb://127.0.0.1:27017/task_manager`.
4. Keep `.env` private. It is ignored by Git; never commit database credentials.

## Install and run

```sh
npm install
npm start
```

For auto-restart during development:

```sh
npm run dev
```

The API listens at `http://localhost:3000` by default. Set `PORT` in `.env` to choose another port. The server connects to MongoDB before it begins listening.

## Endpoints

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| GET | `/tasks` | List all tasks | `200 OK` |
| GET | `/tasks/:id` | Get one task | `200 OK` |
| POST | `/tasks` | Create a task | `201 Created` |
| PUT | `/tasks/:id` | Replace a task's editable fields | `200 OK` |
| DELETE | `/tasks/:id` | Delete a task | `200 OK` |

Task fields: `title` (required string; whitespace is trimmed), `description` (string), `completed` (boolean, defaults to `false`), and `priority` (`low`, `medium`, or `high`, defaults to `medium`). `createdAt` is set automatically.

POST and PUT require `Content-Type: application/json`. Invalid bodies and IDs return structured `400` errors; missing tasks or routes return structured `404` errors. Unexpected errors return a structured `500` response.

## Postman requests

Create a Postman collection or use these requests with the server running. For POST and PUT, choose **Body → raw → JSON** in Postman. Copy the `_id` from the create response and replace `TASK_ID` below.

### List all tasks

- Method: `GET`
- URL: `http://localhost:3000/tasks`

### Create a task

- Method: `POST`
- URL: `http://localhost:3000/tasks`
- Header: `Content-Type: application/json`
- Body:

```json
{
  "title": "  Finish Practical 5  ",
  "description": "Connect the task API to MongoDB",
  "completed": false,
  "priority": "high"
}
```

The returned title should be trimmed. Copy the response task's `_id` for the following requests.

### Get one task

- Method: `GET`
- URL: `http://localhost:3000/tasks/TASK_ID`

### Update a task

- Method: `PUT`
- URL: `http://localhost:3000/tasks/TASK_ID`
- Header: `Content-Type: application/json`
- Body:

```json
{
  "title": "Finish Practical 5",
  "description": "Verified MongoDB persistence",
  "completed": true,
  "priority": "medium"
}
```

### Delete a task

- Method: `DELETE`
- URL: `http://localhost:3000/tasks/TASK_ID`

### Verify persistence

Create a task, stop the server with Ctrl+C, start it again with `npm start`, then send `GET http://localhost:3000/tasks` or `GET /tasks/TASK_ID` in Postman. The task should still be present because it is stored in MongoDB.
