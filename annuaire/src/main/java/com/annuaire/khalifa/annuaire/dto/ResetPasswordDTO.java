package com.annuaire.khalifa.annuaire.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordDTO {
    private String token;       // token reçu par email
    private String newPassword; // nouveau mot de passe choisi par l'utilisateur
}
