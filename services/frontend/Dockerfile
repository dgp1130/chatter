FROM gradle:jdk10 as build

COPY --chown=gradle:gradle services/frontend/ /chatter/services/frontend/
WORKDIR /chatter/services/frontend/
RUN gradle build --no-daemon
# Built at /chatter/services/frontend/build/libs/chatter-all.jar

FROM openjdk:10-jre-slim

WORKDIR /chatter/
COPY --from=build /chatter/services/frontend/build/libs/chatter-all.jar /chatter/services/frontend/server.jar

ENTRYPOINT ["java", "-jar", "/chatter/services/frontend/server.jar"]
