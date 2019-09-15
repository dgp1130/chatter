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

# Compile all *.ts sources to *.js with the same name/path in the build/ directory.
# TypeScript compiler is configured in tsconfig.json.
RUN tsc

FROM build as test

ENTRYPOINT ["npm", "test"]

FROM build as server

EXPOSE 80
ENTRYPOINT ["npm", "start"]
