package com.annuaire.khalifa.annuaire;

import org.keycloak.adapters.springsecurity.KeycloakConfiguration;
import org.keycloak.adapters.springsecurity.authentication.KeycloakAuthenticationProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.mapping.SimpleAuthorityMapper;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.NullAuthenticatedSessionStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;

@Configuration
@KeycloakConfiguration
public class KeycloakSecurityConfig {

    // Fournisseur d'authentification Keycloak
    @Bean
    public KeycloakAuthenticationProvider keycloakAuthenticationProvider() {
        KeycloakAuthenticationProvider provider = new KeycloakAuthenticationProvider();
        provider.setGrantedAuthoritiesMapper(new SimpleAuthorityMapper());
        return provider;
    }

    // Pas de sessions → API REST stateless
    @Bean
    public SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new NullAuthenticatedSessionStrategy();
    }

    // Règles de sécurité

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ROUTES PUBLIQUES
                        .requestMatchers("/api/employes/login").permitAll()
                        .requestMatchers("/api/employes/test-mock/**").permitAll()
                        .requestMatchers("/api/employes/search").permitAll()
                        .requestMatchers("/api/employes").permitAll()
                        .requestMatchers("/api/employes/combined/**").permitAll()

                        // ROUTES ADMIN
                        .requestMatchers("/api/employes/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/employes/**").hasRole("ADMIN") // création, update, delete

                        // AUTRES ROUTES
                        .anyRequest().permitAll()
                );

        return http.build();
    }



    // AuthenticationManager pour injection si besoin
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
