# Task Manager API

A beginner-friendly REST API built with Node.js and Express. Tasks are stored in memory, so they reset when the server restarts.

## Run locally

```sh
npm install
npm start
```

The server listens at `http://localhost:3000`. Set `PORT` to use a different port.

## Endpoints

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| GET | `/tasks` | List every task | `200 OK` |
| POST | `/tasks` | Create a task | `201 Created` |
| PUT | `/tasks/:id` | Replace a task's title and completion state | `200 OK` |
| DELETE | `/tasks/:id` | Delete a task | `200 OK` |

POST and PUT require `Content-Type: application/json` and a non-empty `title`. `completed` is an optional boolean and defaults to `false`. Invalid input returns `400`, a missing task or route returns a structured `404`, wrong content type returns `415`, and unexpected server errors return `500`.

## Sample requests

Create a task:

```sh
curl -i -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Read REST API notes"}'
```

List tasks:

```sh
curl -i http://localhost:3000/tasks
```

Update task 1:

```sh
curl -i -X PUT http://localhost:3000/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{"title":"Review REST API notes","completed":true}'
```

Delete task 1:

```sh
curl -i -X DELETE http://localhost:3000/tasks/1
```

Try error cases:

```sh
curl -i http://localhost:3000/tasks/999
curl -i http://localhost:3000/unknown
curl -i -X POST http://localhost:3000/tasks -d '{"title":"Missing content type"}'
```

## Middleware

1. The request logger prints the HTTP method, URL, and ISO timestamp.
2. `express.json()` parses JSON bodies.
3. `requireJson` enforces JSON content type on POST and PUT.
4. `validateTaskId` rejects IDs that are not positive integers.
5. `validateTaskBody` checks task fields before creating or replacing a task.
6. The structured 404 handler responds when no route matches.
7. The final error handler returns JSON for malformed JSON and unexpected errors.
