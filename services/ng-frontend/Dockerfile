# Image with Chrome to be able execute tests with it.
FROM node:12-slim as chrome

# Install Chrome to execute tests.
RUN apt-get update && apt-get install -y wget gnupg2
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
RUN apt-get update && apt-get install -yq google-chrome-stable

# Installs the Angular application and includes all source files.
FROM chrome as install

WORKDIR /chatter/services/ng-frontend/

# Install dependencies as a separate step, so they don't need to be re-built with every client/
# change.
COPY package.json .
COPY package-lock.json .
RUN npm install
ENV PATH "/chatter/services/ng-frontend/node_modules/.bin/:${PATH}"

# Copy rest of the source code.
COPY . .

# Run local development instance.
FROM install as dev

# Serve with host 0.0.0.0 to allow all incoming connections. This is necessary because Docker uses
# port forwarding, so Angular doesn't know it is only ever accessed locally.
CMD [ "npm", "start", "--", "--host", "0.0.0.0" ]
EXPOSE 4200

# Execute unit tests.
FROM install as test

WORKDIR /chatter/services/ng-frontend/

CMD [ "npm", "test" ]

# Debug unit tests.
FROM install as test-debug

WORKDIR /chatter/services/ng-frontend/

CMD [ "npm", "run", "test-debug" ]
EXPOSE 9876

# Execute end-to-end tests.
FROM install as e2e

# Install ps command for Protractor.
RUN apt-get install -y procps

WORKDIR /chatter/services/ng-frontend/

CMD [ "npm", "run", "e2e" ]

# Production build of Angular app.
FROM install as prod-build

WORKDIR /chatter/services/ng-frontend/

RUN ng build --prod --output-path=dist/

# Production server.
FROM nginx:1.16.0-alpine as prod

# Copy build artifacts to Nginx's serve directory.
COPY --from=prod-build /chatter/services/ng-frontend/dist/ /usr/share/nginx/html/

# Run nginx without a daemon so it plays nicer with Docker.
CMD [ "nginx", "-g", "daemon off;" ]
EXPOSE 80
