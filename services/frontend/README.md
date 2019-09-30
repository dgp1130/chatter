# Chatter Frontend Service

The frontend server for Chatter which serves the raw HTML/JavaScript/CSS bundles to end-user
devices. It is a very "dumb" server, simply serving pre-built static files.

## Useful links

* [Docker Hub Image](https://hub.docker.com/r/dgp1130/chatter-frontend-service)

## Build and run the service

(Executed from project root, not `services/frontend/`.)

```bash
docker build -f services/frontend/Dockerfile -t chatter-frontend-service . \
    && docker run --rm -it -t -p 8000:80 chatter-frontend-service
```

Open your browser to `localhost:8000` to see the app.

## Run tests

(Executed from project root, not `services/frontend/`.)

```bash
docker build -f services/frontend/Dockerfile -t chatter-frontend-test . --target test \
    && docker run --rm -it -t chatter-frontend-test
```

## Local development

An editor like Visual Studio Code won't use Intellisense based on the Docker build.
You'll need to build the project locally (outside of Docker) for many editor features to work.

(Executed from project root, not `services/frontend/`.)

```bash
(cd client && flutter build web)
```
