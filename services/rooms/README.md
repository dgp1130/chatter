# Chatter Rooms Service

The rooms server for Chatter which provides functionality to create and list chat rooms.

## Useful links

* [Docker Hub Image](https://hub.docker.com/r/dgp1130/chatter-rooms-service)

## Build and run the service

This service is dependent on a backend Redis data store. The backend must be started and running
on the same network.

(Executed from project root, not `services/rooms/`).

```bash
# Create a network to run both containers on.
docker network create --driver bridge chatter

# Start the Redis instance on the network with the DNS name `redis`.
docker run --rm -it -t --net chatter --name redis redis

# In a new tab:
# Build and run the rooms service and connect to the development Redis instance.
docker build -f services/rooms/Dockerfile --rm -t chatter-rooms-service . \
    && docker run --rm -it -t -p 8000:80 --net chatter \
        -e CHATTER_DB_SERVICE_SERVICE_HOST="redis" \
        chatter-rooms-service
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
docker build -f services/rooms/Dockerfile --rm -t chatter-rooms-test . --target test \
    && docker run --rm -it -t chatter-rooms-test
```

### Debug tests

To open a debugger when running tests, you can add a `debugger;` statement in the file you are
interested in. In Chrome, go to [chrome://inspect](chrome://inspect) and select "Open Dedicated
DevTools for Node". Finally, run (from project root, not `services/rooms/`):

```bash
docker build -f services/rooms/Dockerfile --rm -t chatter-rooms-test-debug . --target test-debug \
    && docker run --rm -it -p 9229:9229 -t chatter-rooms-test-debug
```

This should automatically connect to the Chrome DevTools window and break on the `debugger;`
statement. You can then inspect local variables, set breakpoints, and so on.

## Database schema

The application is run off a single persistent [Redis](https://redis.io) store. A rough outline of
the schema is as follows:

### Room

A "Room" represents a "chatroom" which users can join, send, and receive messages. Currently the
data type is represented in the data store as:

```typescript
interface Room {
    id: number;
    name: string;
}
```

#### Accessing Rooms

Room data can be accessed via two key locations:

```text
rooms.byId.${id}
```

A hash map of room properties indexable by ID. Expires 24 hours after creation/last message sent.

```text
rooms.byCreationTimestamp
```

An ordered set of room IDs scored by creation timestamp. By policy, these rooms "expire" 24 hours,
after creation/last message sent. However this is not currently implemented in the database at this
key. Clients accessing this value must manually limit their search to the last 24 hours or they risk
reading room IDs which are no longer accessible via `rooms.byId.${id}`.

In the future, a batch job may run to garbage collect dead rooms from the store.

```text
rooms.currId
```

The current ID value owned by a Room. No ID value greater than this is owned by an existing Room.
