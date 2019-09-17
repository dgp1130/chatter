# Chatter

Chat application built with a Go server and Flutter client.

A running instance is available at [http://chatter.technology/](http://chatter.technology/),
hosted on [Google Cloud Platform](https://cloud.google.com/) w/
[Google Domains](https://domains.google.com).

[![Build Status](https://travis-ci.com/dgp1130/chatter.svg?branch=master)](https://travis-ci.com/dgp1130/chatter)

## Motivation

Just having some fun with a simple project. Wanted to play around with
Go channels and this seems like a relatively straightfowarded way of
doing that. Also wanted to play around more with Flutter, can try out
their new web technical preview at the same time for the client.

## Development

To actually run the server:

### Install Dependencies

To run the project, you'll need:

* [Git](https://git-scm.com) (or you could download the zip, but who does that?)
* [Docker](https://docker.com)
* [Kubernetes](https://kubernetes.io/) with
  [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)

### Dev Dependencies

If you want to develop with an editor that understands the project, you'll
probably also want:

* [Go Lang](https://golang.org)
* [Flutter](https://github.com/flutter/flutter)

### Get the Source Code

```bash
git clone https://github.com/dgp1130/chatter .
```

### Run the entire Kubernetes service locally

This service is configured to be deployed with Kubernetes. Individual microservices have their own
README files which describe how to run/debug/test them. The entire Kubernetes configuration can be
tested locally by starting up the entire service:

```bash
# Start Minikube environment.
minikube start
eval $(minikube docker-env)

# Build services.
docker build -f services/frontend/Dockerfile -t chatter-frontend-service:latest .
docker build -f services/rooms/Dockerfile -t chatter-rooms-service:latest .

# Apply Kubernetes configuration while only using local images.
kubectl apply -f k8s.yaml --image-pull-policy=Never

# Open app in browser.
minikube service chatter

# Stop Kubernetes.
kubectl delete service/chatter deployment.apps/chatter
minikube stop
```

### Local development

An editor like Visual Studio Code won't use Intellisense based on the Docker build.
You'll need to build the project locally (outside of Docker) for many editor features to work.

```bash
# Build client manually.
(cd client && flutter build web)

# Test client.
# Note: This only runs non-UI tests because Flutter Web testing isn't well supported atm.
(cd client && flutter packages pub run test)

# Run server manually.
go run server/server.go

# Test server.
go test ./...
```
