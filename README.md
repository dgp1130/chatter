# Chatter

Chat application built with a Go server and Flutter client.

## Motivation

Just having some fun with a simple project. Wanted to play around with
Go channels and this seems like a relatively straightfowarded way of
doing that. Also wanted to play around more with Flutter, can try out
their new web technical preview at the same time for the client.

## Runbook

To actually run the server:

### Install Dependencies

*   [Git](https://git-scm.com) (or you could download the zip, but who does that?)
*   [Go Lang](https://golang.org)
*   [Flutter Web (technical preview)](https://github.com/flutter/flutter_web)

### Build and Start the Server

```bash
# Clone the repo.
git clone https://github.com/dgp1130/chatter
cd chatter

# Install server dependencies.
go get -u https://github.com/gin-gonic/gin
go get -u https://github.com/gin-contrib/static

# Build client (webdev command comes from the Flutter Web technical preview).
(cd client && webdev build)

# Test client.
# Note: This only tests non-UI tests because Flutter Web testing isn't well supported atm.
(cd client && pub run test/**/*.dart)

# Run server.
go run server/server.go
```