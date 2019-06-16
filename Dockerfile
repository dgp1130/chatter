FROM google/dart AS flutter

RUN apt-get update
RUN apt-get install -y wget xz-utils

# Download and extract Flutter to /flutter.
RUN wget https://storage.googleapis.com/flutter_infra/releases/stable/linux/flutter_linux_v1.5.4-hotfix.2-stable.tar.xz -O /tmp/flutter.tar.xz
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
RUN flutter pub global activate webdev
RUN flutter packages upgrade

# Copy rest of client/ subdrectories. Don't include all of client/ because
# it may contain locally generated files like client/.packages which can
# corrupt the hermetic Docker build.
COPY client/assets/ assets/
COPY client/lib/ lib/
COPY client/web/ web/
RUN flutter packages pub global run webdev build --no-release

FROM golang AS server

# Install dependencies as a separate step, so they don't need to be re-built
# with ever server/ change.
WORKDIR /chatter/
COPY go.mod .
COPY go.sum .
RUN go mod download

# Copy server source code and build it.
COPY server/ /chatter/server/
WORKDIR /chatter/server/
RUN go build

# Copy over static files from client to serve.
COPY --from=client /chatter/client/assets/ /chatter/client/assets/
COPY --from=client /chatter/client/build/ /chatter/client/build/

# Switch working directory so server file paths line up to client static files.
WORKDIR /chatter/

# Export server port and executable.
EXPOSE 8080
ENTRYPOINT ["/chatter/server/server"]