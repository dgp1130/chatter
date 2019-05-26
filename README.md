# Chatter

Chat application built with a Go server and Flutter client.

## Motivation

Just having some fun with a simple project. Wanted to play around with
Go channels and this seems like a relatively straightfowarded way of
doing that. Also wanted to play around more with Flutter, can try out
their new web build at the same time for the client.

## Runbook

```bash
# Clone the repo.
git clone https://github.com/dgp1130/chatter
cd chatter

# Install dependencies.
go get -u https://github.com/gin-gonic/gin
go get -u https://github.com/gin-contrib/static

# Run server.
go run server/server.go
```