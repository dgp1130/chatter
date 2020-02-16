FROM node:11-slim as deps

WORKDIR /chatter/services/rooms/
COPY package.json .
COPY package-lock.json .

# Install dependencies early to cache them and skip this step for rebuilds.
RUN npm install

FROM deps as build

COPY . .

RUN npm run build

FROM build as server

EXPOSE 80
ENTRYPOINT ["npm", "start"]

FROM build as test

ENTRYPOINT ["npm", "test"]

FROM build as test-debug

ENTRYPOINT ["npm", "run", "test:debug"]
