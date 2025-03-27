# Usa uma imagem oficial do OpenJDK 17 como base
FROM openjdk:17-jdk-slim

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o arquivo JAR correto gerado pelo Maven para dentro do contêiner
COPY target/idata-0.0.1-SNAPSHOT.jar app.jar

# Exposição da porta usada pelo Spring Boot
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
