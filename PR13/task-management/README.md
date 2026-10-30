# TaskFlow

## Run with Docker

From this directory, start the app and its MongoDB database:

```sh
docker compose up --build
```

Open <http://localhost:5173>. The API is available at <http://localhost:5001/api> and its health endpoint is <http://localhost:5001/api/health>.

Stop the containers with `Ctrl+C`, or run `docker compose down`. To also remove the saved database, run `docker compose down -v`.

## Practical 13: AI task descriptions

The backend uses the official OpenAI Node.js SDK and the `gpt-4o-mini` model to suggest a concise description from a task title. The API key stays in the backend environment and is never sent to the frontend.

### Configure the backend

The backend `.env` is ignored by Git. It is provided with a placeholder key; replace that placeholder locally with an API key from the OpenAI API dashboard:

```env
OPENAI_API_KEY=your_actual_api_key
```

Keep this value private. Do not put it in a frontend environment file or commit it. ChatGPT subscriptions do not include API usage credits; API usage may require billing or available credits. If the key is missing, invalid, or the OpenAI request times out, the endpoint returns an editable fallback description and normal task creation remains available.

### Run locally

In one terminal, start MongoDB and the API:

```sh
cd backend
npm install
npm start
```

In another terminal, start the frontend:

```sh
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The frontend sends AI requests to `http://localhost:5000/api/ai/generate-description` by default. Set `VITE_API_URL` in a local frontend `.env` file if your API uses another base URL. The frontend `.env.example` contains a local development URL and has no secrets.

### Test the endpoint

Send a JSON request to `POST http://localhost:5000/api/ai/generate-description`:

```json
{
  "title": "Prepare the customer interview guide"
}
```

A successful response contains `description` and `fallback: false`. If OpenAI is unavailable, the endpoint responds with a usable `description`, `fallback: true`, and a message explaining the fallback. Empty or overlong titles receive HTTP 400. A repeat request for the same title within one minute receives HTTP 429. The backend times out OpenAI calls after 15 seconds.

In the app, choose **New task**, enter a title, then select **Generate description**. While it loads, the button shows **Generating…**. The suggestion appears in the existing editable description field, alongside the required review disclaimer. Edit or replace it before selecting **Create task**. AI failure does not disable manual task creation.

The rate limit is held in memory and resets when the backend restarts; it is intended for this practical, not as a distributed production limiter.
