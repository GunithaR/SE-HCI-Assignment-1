#FROM openjdk:17-jdk-slim
#WORKDIR /app
#COPY . .
#RUN apt-get update && apt-get install -y maven
#RUN mvn clean install
#CMD java -jar target/*.jar


# ---------- BUILD STAGE ----------

FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# ---------- RUN STAGE ----------

FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]