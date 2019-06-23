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

To run the project, you'll need:

*   [Git](https://git-scm.com) (or you could download the zip, but who does that?)
*   [Docker](https://docker.com)
*   [Kubernetes](https://kubernetes.io/) with
    [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)

### Dev Dependencies

If you want to develop with an editor that understands the project, you'll
probably also want:

*   [Go Lang](https://golang.org)
*   [Flutter Web (technical preview)](https://github.com/flutter/flutter_web)

### Build and Start the Server

```bash
# Clone the repo.
git clone https://github.com/dgp1130/chatter .

# Run server on port 8080.
docker build -t chatter .
docker run --rm -p 8080:8080 chatter

# Run application on Kubernetes via Minikube.
minikube start
kubectl apply -f k8s.yaml
minikube service chatter # Opens app in browser.

# Stop Kubernetes.
kubectl delete service/chatter deployment.apps/chatter
minikube stop
```

### Development

An editor like Visual Studio Code won't use Intellisense based on the Docker build.
You'll need to build the project locally for many editor features to work.

```bash
# Build client manually.
(cd client && webdev build)

# Test client.
# Note: This only runs non-UI tests because Flutter Web testing isn't well supported atm.
(cd client && pub run test)

# Run server manually.
go run server/server.go

# Test server.
go test ./...
```