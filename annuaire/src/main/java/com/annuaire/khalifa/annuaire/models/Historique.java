package com.annuaire.khalifa.annuaire.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "historiques")
public class Historique {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "employe_id", nullable = true) // nullable = true pour éviter erreur
    private Employe employe;

    @Column(name = "actions", nullable = false)
    private String action;

    @Column(name = "utilisateur")
    private String utilisateur;

    @Column(name = "date_action", nullable = false)
    private LocalDate dateAction;

    public Historique() {}

    public Historique(Employe employe, String action, String utilisateur, LocalDate dateAction) {
        this.employe = employe; // peut être null si l'employé n'existe pas encore
        this.action = action;
        this.utilisateur = utilisateur;
        this.dateAction = dateAction;
    }
}
