FROM node:10-slim as tsc

RUN npm install -g typescript

FROM tsc as deps

COPY services/frontend/package.json .
COPY services/frontend/package-lock.json .

RUN npm install

FROM deps as build

WORKDIR /chatter/services/frontend

COPY services/frontend/ .

RUN tsc src/server.ts
# Outputs as src/server.js

ENTRYPOINT ["npm", "start"]
