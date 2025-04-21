package com.fatecipiranga.idata.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    private static final Logger LOGGER = LoggerFactory.getLogger(CorsConfiguration.class);

    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        LOGGER.info("Configurando CORS para permitir origens: http://localhost, http://localhost:4200");
        registry.addMapping("/**")
                .allowedOrigins("http://localhost", "http://localhost:4200")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "TRACE", "CONNECT")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}