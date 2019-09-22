# Chatter Rooms Service

The rooms server for Chatter which provides functionality to create and list chat rooms.

## Build and run the service

(Executed from project root, not `services/rooms/`).

```bash
docker build -f services/rooms/Dockerfile -t chatter-rooms-service . \
    && docker run --rm -it -t -p 8000:80 chatter-rooms-service
```

## Manually test APIs

There are two APIs currently supported.

### `/api/rooms/create`

A room can be created by making a `POST` request to `/api/rooms/create`. It accepts a JSON body with
the `name` value set to a string. Make sure to include the content type as `application/json`, as
that is required for the server to parse the request correctly.

```bash
curl -X POST localhost:8000/api/rooms/create \
    -H "Content-Type: application/json" \
    -d '{"name": "Bar"}'

```

### `/api/rooms/list`

All created rooms can be listed by making a `GET` request to `/api/rooms/list`. Any previously
created rooms should be returned here.

```bash
curl localhost:8000/api/rooms/list
```

## Run tests

(Executed from project root, not `services/rooms/`).

```bash
docker build -f services/rooms/Dockerfile -t chatter-rooms-test . --target test \
    && docker run --rm -it -t chatter-rooms-test
```
