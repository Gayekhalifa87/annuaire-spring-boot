//
package com.annuaire.khalifa.annuaire;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class KeycloakTokenService {

    private static final String TOKEN_URL = "http://localhost:8180/realms/annuaire/protocol/openid-connect/token";
    private static final String CLIENT_ID = "annuaire-backend"; // Changé pour utiliser le client backend
    private static final String CLIENT_SECRET = "qeUtWhSI6qygPgsYTmyuv7vZdMAPIWqj"; // Client secret pour le client backend

    public Map<String, Object> getToken(String username, String password) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("client_id", CLIENT_ID);
        body.add("client_secret", CLIENT_SECRET); // Maintenant activé car client confidential
        body.add("grant_type", "password");
        body.add("username", username);
        body.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(TOKEN_URL, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            return response.getBody();
        } else {
            throw new RuntimeException("Impossible d'obtenir le token Keycloak: " + response.getStatusCode());
        }
    }

    public boolean validateToken(String token) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            String introspectUrl = "http://localhost:8180/realms/annuaire/protocol/openid-connect/token/introspect";
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("client_id", CLIENT_ID);
            body.add("client_secret", CLIENT_SECRET);
            body.add("token", token);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(introspectUrl, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return (Boolean) response.getBody().get("active");
            }
        } catch (Exception e) {
            // Log the error
        }
        return false;
    }
}