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


#FROM maven:3.8.6-jdk-8 AS builder
#WORKDIR /app
#COPY pom.xml .
#RUN mvn dependency:go-offline -B
#COPY src ./src
#RUN mvn package -DskipTests



# Use a base image with Java 17
FROM openjdk:21

# Set the working directory inside the container
#WORKDIR /app

# Copy the JAR file into the container
COPY ./target/Restaurant-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app runs on (default Spring Boot port is 8080)
EXPOSE 8080

# Command to execute the application
ENTRYPOINT ["java", "-jar", "/app.jar"]


