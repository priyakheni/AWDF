# Practical 7 — Authenticated Task Manager API

## Configure and run

1. Start MongoDB locally or create a MongoDB Atlas database.
2. Copy `.env.example` to `.env` if needed.
3. Set `MONGO_URI` to your database and generate `JWT_SECRET` with `openssl rand -hex 32`. Keep `.env` private; it is excluded by `.gitignore`.
4. Set `PORT` and `CLIENT_ORIGIN` for your setup. This Mac uses port `5002` because local services occupy `5000` and `5001`; the application defaults to `5000` elsewhere. The Vite origin is `http://localhost:5173`.
5. Start the API:

```sh
npm install
npm start
```

## Postman authentication

Use `http://localhost:5002` as the base URL on this machine. For JSON requests, set `Content-Type: application/json`.

### Register

`POST /auth/register`

```json
{
  "email": "student@example.com",
  "password": "Practical7!Secure"
}
```

The response includes the public user only; the password is hashed before it is stored.

### Log in

`POST /auth/login`

Use the same JSON body. Copy the returned `token`. In Postman, set **Authorization → Bearer Token** to that token for the requests below. Tokens expire after one hour.

### Get the current user

`GET /me`

Expected: `200 OK` with the user's ID, email, and creation date.

### List the current user's tasks

`GET /tasks`

Expected: `200 OK`. Without a token, the response is `401 Unauthorized`.

### Create a task

`POST /tasks`

```json
{
  "title": "  Finish Practical 7  ",
  "description": "Test authenticated task storage",
  "completed": false,
  "priority": "high"
}
```

Copy the returned task `_id` for the following requests. The title is trimmed, and the response omits the owner ID.

### View and update a task

`GET /tasks/TASK_ID`

`PUT /tasks/TASK_ID`

```json
{
  "title": "Finish Practical 7",
  "description": "Authentication and validation verified",
  "completed": true,
  "priority": "medium"
}
```

### Delete a task

`DELETE /tasks/TASK_ID`

### Check invalid and expired tokens

- Set Bearer Token to `not.a.valid.token` and request `GET /tasks`; expect `401`.
- To make a token that is already expired for testing, run this from the backend folder and replace the subject with a user ID from `/me`:

```sh
node --input-type=module -e 'import "dotenv/config"; import jwt from "jsonwebtoken"; console.log(jwt.sign({ sub: "USER_ID" }, process.env.JWT_SECRET, { expiresIn: -1 }))'
```

Use the printed token as Bearer Token; `GET /tasks` should return `401` with an expired-session message. Never paste the JWT secret itself into Postman.

### Check input validation

Try registering with an invalid email or a password shorter than 8 characters (expect `400`), registering the same email twice (expect `409`), or creating a task with an empty title or unsupported priority (expect `400`). A user can only view, update, or delete their own tasks.
