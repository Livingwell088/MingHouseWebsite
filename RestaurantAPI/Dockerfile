## Use a base image with Java 17
#FROM openjdk:21
#
## Set the working directory inside the container
##WORKDIR /app
#
## Copy the JAR file into the container
#COPY ./target/Restaurant-0.0.1-SNAPSHOT.jar app.jar
#
## Expose the port the app runs on (default Spring Boot port is 8080)
##EXPOSE 8080
#
## Command to execute the application
#ENTRYPOINT ["java", "-jar", "/app.jar"]



FROM maven:3.8-jdk-11
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn dependency:go-offline -B
RUN mvn clean install -DskipTests

COPY ./target/Restaurant-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "target/*.jar"]


