# TaskFlow

## Run with Docker

From this directory, start the app and its MongoDB database:

```sh
docker compose up --build
```

Open <http://localhost:8080>. The API is available at <http://localhost:5000/api> and its health endpoint is <http://localhost:5000/api/health>.

Stop the containers with `Ctrl+C`, or run `docker compose down`. To also remove the saved database, run `docker compose down -v`.
