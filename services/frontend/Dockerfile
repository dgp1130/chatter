FROM google/dart:2.4 AS flutter

RUN apt-get update && apt-get install -y \
    unzip \
    wget \
    xz-utils

# Download and extract Flutter to /flutter.
RUN wget -nv https://storage.googleapis.com/flutter_infra/releases/stable/linux/flutter_linux_v1.9.1+hotfix.2-stable.tar.xz -O /tmp/flutter.tar.xz \
    && mkdir /flutter/ \
    && tar xf /tmp/flutter.tar.xz -C /flutter/ --strip-components=1 \
    && rm /tmp/flutter.tar.xz

# Add Flutter and packages to the path.
ENV PATH="/flutter/bin:/flutter/.pub-cache/bin:${PATH}"

# Make sure Flutter builds using the correct dependency cache.
ENV PUB_CACHE="/flutter/.pub-cache"

# Upgrade Flutter and precache content.
# Note: This is not hermetic becuase it uses the master branch directly,
# however Flutter web does not have an official release version yet. This
# should be updated to hard code a specific Flutter release version when able.
RUN flutter channel master \
    && flutter upgrade \
    && flutter config --enable-web --no-analytics \
    && flutter precache

FROM flutter as client

WORKDIR /chatter/client/

# Install dependencies as a separate step, so they don't need to be re-built
# with every client/ change.
COPY client/pubspec.yaml .
COPY client/pubspec.lock .
RUN flutter packages get

# Copy rest of client/ subdrectories. Don't include all of client/ because
# it may contain locally generated files like client/.packages which can
# corrupt the hermetic Docker build.
COPY client/assets/ assets/
COPY client/lib/ lib/
COPY client/web/ web/
RUN flutter build web
# Client is built at /chatter/client/build/web/...

FROM client as test

COPY client/test/ test/
ENTRYPOINT ["flutter", "packages", "pub", "run", "test"]

FROM node:10-slim as tsc

RUN npm install -g typescript

FROM tsc as deps

WORKDIR /chatter/services/frontend/
COPY services/frontend/package.json .
COPY services/frontend/package-lock.json .

# Install dependencies early to cache them and skip this step for rebuilds.
RUN npm install

FROM deps as server

COPY services/frontend/ .

RUN tsc src/server.ts
# Outputs as src/server.js

# Copy over static files from client to serve.
COPY --from=client /chatter/client/assets/ /chatter/client/assets/
COPY --from=client /chatter/client/build/web/ /chatter/client/build/web/

EXPOSE 80
ENTRYPOINT ["npm", "start"]
