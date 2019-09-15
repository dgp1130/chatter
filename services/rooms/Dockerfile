FROM node:10-slim as tsc

RUN npm install -g typescript

FROM tsc as deps

WORKDIR /chatter/services/rooms/
COPY services/rooms/package.json .
COPY services/rooms/package-lock.json .

# Install dependencies early to cache them and skip this step for rebuilds.
RUN npm install

FROM deps as build

COPY services/rooms/ .

RUN tsc src/server.ts
# Outputs as src/server.js

EXPOSE 80
ENTRYPOINT ["npm", "start"]
