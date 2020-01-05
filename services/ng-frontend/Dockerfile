# Installs the Angular application and includes all source files.
FROM node:12-slim as install

WORKDIR /chatter/services/ng-frontend/

# Install dependencies as a separate step, so they don't need to be re-built with every client/
# change.
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy rest of the source code.
COPY . .

# Run local development instance.
FROM install as dev

# Serve with host 0.0.0.0 to allow all incoming connections. This is necessary because Docker uses
# port forwarding, so Angular doesn't know it is only ever accessed locally.
CMD [ "npm", "start", "--", "--host", "0.0.0.0" ]
EXPOSE 4200
