FROM gradle:jdk12 as build

# Pull dependencies first so this is only dependent on the Gradle file. Chaning regular source code
# won't require a re-download.
WORKDIR /chatter/services/frontend/
COPY --chown=gradle:gradle services/frontend/build.gradle .
RUN gradle dependencies --no-daemon

# Build the server.
COPY --chown=gradle:gradle services/frontend/ .
RUN gradle build --no-daemon
# Built at /chatter/services/frontend/build/libs/chatter.jar

FROM openjdk:12-alpine

WORKDIR /chatter/
COPY --from=build /chatter/services/frontend/build/libs/chatter.jar /chatter/services/frontend/server.jar

ENTRYPOINT ["java", "-jar", "/chatter/services/frontend/server.jar"]
