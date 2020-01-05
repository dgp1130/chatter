# Chatter Angular Frontend Service

The frontend server for Chatter which serves the raw HTML/JavaScript/CSS Angular bundles to end-user
devices. It is a very "dumb" server, simply serving pre-built static files.

## Local development with Docker

Docker is the easiest way to build/run/test the application because it does not require external
dependencies on your developer machine. The only installations needed are
[Docker](https://docker.com) and [docker-compose](https://docs.docker.com/compose/)

### Development environment

To start a development environment, run the following command:

```shell
docker-compose up --build dev
```

Note: If you want to run this command from repository root, rather than `services/ng-frontend/`, you
can include `-f services/ng-frontend/docker-compose.yaml`.

This will bring up a development server on port 4200. You can view the app by visiting
[http://localhost:4200/](http://localhost:4200/).

This supports live reload and will automatically rebuild and refresh the page when a file is edited.
You may need to restart the server when NPM dependencies are modified.

## Local development without Docker

To build/run/test the client side application **without** using Docker, you will need to install the
[Angular CLI](https://github.com/angular/angular-cli).

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically
reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
