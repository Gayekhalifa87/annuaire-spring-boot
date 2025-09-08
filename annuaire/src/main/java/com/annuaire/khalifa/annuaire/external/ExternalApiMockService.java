package com.annuaire.khalifa.annuaire.external;

import org.springframework.stereotype.Service;

@Service
public class ExternalApiMockService {

    public ExternalEmployeDTO getExternalEmploye(int externalId) {
        ExternalEmployeDTO dto = new ExternalEmployeDTO();
        dto.setId(externalId);
        dto.setNom("Sarr" + externalId);
        dto.setPrenom("Aliou" + externalId);

        // Email fixe pour le test
        dto.setEmail("gayekhalifa99@gmail.com");

        dto.setDirection("DSI");
        dto.setService("Developpement");
        dto.setPoste("Developpeur");
        return dto;
    }
}
