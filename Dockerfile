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

FROM golang:1.12.7 AS server

# Install dependencies as a separate step, so they don't need to be re-built
# with every server/ change.
WORKDIR /chatter/
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy server source code and build it.
# Build is statitically linked so it can be copied outside the container.
COPY server/ /chatter/server/
WORKDIR /chatter/server/
RUN CGO_ENABLED=0 GOOS=linux go build -a -ldflags '-extldflags "-static"' .
# Server binary is built at /chatter/server/server.

FROM scratch AS final

# Copy over static files from client to serve.
COPY --from=client /chatter/client/assets/ /chatter/client/assets/
COPY --from=client /chatter/client/build/ /chatter/client/build/
COPY --from=server /chatter/server/server /chatter/server/server

# Switch working directory so server file paths line up to client static files.
WORKDIR /chatter/

# Export server port and executable.
EXPOSE 80
ENTRYPOINT ["/chatter/server/server"]
