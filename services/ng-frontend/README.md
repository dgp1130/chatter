# Chatter Angular Frontend Service

The frontend server for Chatter which serves the raw HTML/JavaScript/CSS Angular bundles to end-user
devices. It is a very "dumb" server, simply serving pre-built static files.

Test files are identified by the `*.spec.ts` suffix in their file names.

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

### Running unit tests

To execute tests, run:

```shell
docker-compose up --build test
```

This will run unit tests once and print their output to the console.

If you want to debug failing tests, run:

```shell
docker-compose up --build test-debug
```

This will run unit tests and watch source files to rerun tests on any change. To debug, open a
browser to [http://localhost:9876/debug.html](http://localhost:9876/debug.html).

### Running end-to-end (e2e) tests

To execute end-to-end tests locally, run:

```shell
docker-compose up --build e2e
```

There is no great way to debug end-to-end tests using Docker (see
[this issue](https://github.com/angular/angular-cli/issues/16683)). As a result, debugging needs to
be done directly with local installs of the relevant tools. To debug end-to-end tests locally, start
by opening dedicated DevTools for Node by visiting [chrome://inspect](chrome://inspect) (make sure
it is watching port 9229). Then, add a `debugger;` statement in the test you are interested in and
run:

```shell
# Run a dev instance
docker-compose up --build dev

# In new terminal tab....

# Run Protractor with relevant debug arguments.
npm run e2e-debug
```

This will run the test and break at the `debugger;` statement. You can then step around, add more
breakpoints, and inspect local variables.

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
