# Chatter

Chat application built with NodeJS TypeScript microservices and a Flutter client.

[![Build Status](https://travis-ci.com/dgp1130/chatter.svg?branch=master)](https://travis-ci.com/dgp1130/chatter)

## Motivation

Just having some fun with a simple project. Wanted to play around with a few new technologies.
Most notably this is using [Flutter Web](https://flutter.dev/web) to make a simple Single-Page App
served using a microservice architecture with [Kubernetes](https://kubernetes.io/) and
[Docker](https://www.docker.com/). Using Kubernetes for such a simple service is clearly overkill
but I really just want to play with the technologies so I'm not that concerned with practicality.

Some future work I hope to get around to at some point:

* Switch from Flutter Web to Angular (just to learn a little more about the Angular dev experience).
* Set up SSL.
* Convert JSON endpoints to gRPC.
* Create a development instance (`dev.chatter.technology`) for pre-production testing.
* Set up GitHub Actions to auto deploy to Kubernetes cluster.

## Useful Links

Below is a list of links to project-specific resources. Most of these require authentication to view
and/or edit and will only work for me, I'm just listing these out so I don't forget and struggle to
find them in the future.

* [Docker Hub author](https://hub.docker.com/u/dgp1130)
* [Continuous Integration](https://travis-ci.com/dgp1130/chatter)
  * [Configuration file](.travis.yml)
* [Chatter Google Group](https://groups.google.com/forum/#!forum/chatter-technology)
  * This owns the mailing list for managing automated emails.

## Architecture

![Architecture Diagram](https://g.gravizo.com/source/svg?https://raw.githubusercontent.com/dgp1130/chatter/master/doc/architecture.dot)

### Services

* [Frontend](services/frontend/README.md)
* [Angular Frontend](services/ng-frontend/README.md)
* [Rooms](services/rooms/README.md) ![Deployment](https://github.com/dgp1130/chatter/workflows/Docker%20Publish%20Rooms%20Service/badge.svg)

## Development

Most development should be done on a service-by-service basis, so most of the time you only need to
run a single service and develop against that directly. Each service should have its own
documentation defining how it works and how to develop against it.

## Running the Entire Application

When messing with the Kubernetes config, testing should be done locally with Minikube. In this case,
it is necessary to run all the microservices locally.

### Install Dependencies

To run the entire application, you'll need:

* [Git](https://git-scm.com) (or you could download a zip of the source code, but who does that?)
* [Docker](https://docker.com)
* [Kubernetes](https://kubernetes.io/) with
  [Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)

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
minikube addons enable ingress

# Build services.
docker build -f services/frontend/Dockerfile -t dgp1130/chatter-frontend-service:latest .
docker build -f services/rooms/Dockerfile -t dgp1130/chatter-rooms-service:latest services/rooms/ --target server

# Push services to Minikube Docker environment.
# HACK: We should just build these in the Minikube context, but the frontend server refuses to build
# for an unknown reason. This is a workaround for the time being.
docker save dgp1130/chatter-frontend-service | (eval $(minikube docker-env) && docker load)
docker save dgp1130/chatter-rooms-service | (eval $(minikube docker-env) && docker load)

# Apply Kubernetes configuration while only using local images.
# NOTE: By default this will likely pull images from Docker Hub rather than using the local ones
# just pushed. You probably want to edit deployments/app.yaml to specify `imagePullPolicy: Never` on
# the deployment configurations before running this step.
kubectl apply -f <(kustomize services/rooms/deployment/platforms/minikube/)
kubectl apply -f deployments/app.yaml

# Add Minikube IP to /etc/hosts. The application *must* be opened with a *.chatter.technology domain
# or else the nginx ingress will not route requests correctly.
echo -e "$(minikube ip)\tdev.chatter.technology" | sudo tee -a /etc/hosts > /dev/null

# Open app in default browser.
sensible-browser dev.chatter.technology

# Stop Kubernetes.
kubectl delete services/chatter-{frontend,rooms,db}-service \
    deployment.apps/chatter-{frontend,rooms,db}-deployment \
    ingress/chatter-ingress \
    pv/chatter-db-volume pvc/chatter-db-claim
minikube stop
```

## Deployment

Since the Kubernetes configs for Minikube and GKE differ slightly, there a separate infrastructure
module to be used. To deploy to GKE, simply run:

```bash
kubectl apply -f <(kustomize build services/rooms/deployment/platforms/gke)
kubectl apply -f deployments/app.yaml
```
