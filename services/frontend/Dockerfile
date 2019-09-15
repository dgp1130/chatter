FROM google/dart:2.4 AS flutter

RUN apt-get update && apt-get install -y \
    wget \
    xz-utils

# Download and extract Flutter to /flutter.
RUN wget -nv https://storage.googleapis.com/flutter_infra/releases/stable/linux/flutter_linux_v1.7.8+hotfix.4-stable.tar.xz -O /tmp/flutter.tar.xz
RUN mkdir /flutter/
RUN tar xf /tmp/flutter.tar.xz -C /flutter/ --strip-components=1

# Add Flutter and packages to the path.
ENV PATH="/flutter/bin:/flutter/.pub-cache/bin:${PATH}"

# Precache Flutter packages.
RUN flutter precache

FROM flutter as client

WORKDIR /chatter/client/

# Install dependencies as a separate step, so they don't need to be re-built
# with every client/ change.
COPY client/pubspec.yaml .
COPY client/pubspec.lock .
RUN flutter pub global activate webdev 2.3.0
RUN flutter packages upgrade

# Copy rest of client/ subdrectories. Don't include all of client/ because
# it may contain locally generated files like client/.packages which can
# corrupt the hermetic Docker build.
COPY client/assets/ assets/
COPY client/lib/ lib/
COPY client/web/ web/
RUN flutter packages pub global run webdev build --no-release
# Client is built at /chatter/client/build/...

FROM client as client-test

ADD client/test/ test/
ENTRYPOINT ["pub", "run", "test"]

FROM node:10-slim as tsc

RUN npm install -g typescript

FROM tsc as deps

COPY services/frontend/package.json .
COPY services/frontend/package-lock.json .

# Install dependencies early to cache them and skip this step for rebuilds.
RUN npm install

FROM deps as build

WORKDIR /chatter/services/frontend/
COPY services/frontend/ .

RUN tsc src/server.ts
# Outputs as src/server.js

# Copy over static files from client to serve.
COPY --from=client /chatter/client/assets/ /chatter/client/assets/
COPY --from=client /chatter/client/build/ /chatter/client/build/

EXPOSE 80
ENTRYPOINT ["npm", "start"]
