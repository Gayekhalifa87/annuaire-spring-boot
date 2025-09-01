package com.annuaire.khalifa.annuaire.external;

import org.springframework.stereotype.Service;

@Service
public class ExternalApiMockService {

    public ExternalEmployeDTO getExternalEmploye(int externalId) {
        ExternalEmployeDTO dto = new ExternalEmployeDTO();
        dto.setId(externalId);
        dto.setNom("NomSimulé" + externalId);
        dto.setPrenom("PrénomSimulé" + externalId);
        dto.setEmail("user" + externalId + "@exemple.com");
        dto.setDirection("Direction Simulée");
        dto.setService("Service Simulé");
        dto.setPoste("Poste Simulé");
        return dto;
    }
}
