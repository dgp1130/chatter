# Chatter Frontend Service

The frontend server for Chatter which serves the raw HTML/JavaScript/CSS bundles to end-user
devices. It is a very "dumb" server, simply serving pre-built static files.

## Build and run the service

(Executed from project root, not `services/frontend/`).

```bash
docker build -f services/frontend/Dockerfile -t chatter-frontend-service . \
    && docker run --rm -it -t -p 8000:80 chatter-frontend-service
```

Open your browser to `localhost:8000` to see the app.

## Run tests

(Executed from project root, not `services/frontend/`).

```bash
docker build -f services/frontend/Dockerfile -t chatter-frontend-test . --target test \
    && docker run --rm -it -t chatter-frontend-test
```
