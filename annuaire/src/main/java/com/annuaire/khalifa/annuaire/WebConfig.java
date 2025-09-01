package com.annuaire.khalifa.annuaire;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")                 // Toutes les routes
                .allowedOrigins("http://localhost:4200")  // Ton Angular
                .allowedMethods("*")               // GET, POST, PUT, DELETE...
                .allowedHeaders("*")               // Tous les headers
                .allowCredentials(true);           // Si cookies/session
    }
}
