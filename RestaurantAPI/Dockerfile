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
#FROM openjdk:21
#
## Set the working directory inside the container
##WORKDIR /app
#
## Copy the JAR file into the container
#COPY ./target/Restaurant-0.0.1-SNAPSHOT.jar app.jar
#COPY ./src src
#
## Expose the port the app runs on (default Spring Boot port is 8080)
#EXPOSE 8080
#
## Command to execute the application
#ENTRYPOINT ["java", "-jar", "/app.jar"]


FROM maven:3.9.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests


# Use official Java runtime
FROM eclipse-temurin:17-jdk-jammy

# Set working directory
WORKDIR /app

# Copy built jar file
#COPY target/*.jar app.jar
#COPY ./src src

COPY --from=build /app/target/*.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
