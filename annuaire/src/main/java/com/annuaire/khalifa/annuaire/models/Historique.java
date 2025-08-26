package com.annuaire.khalifa.annuaire.models;

import jakarta.persistence.*;
import lombok.Generated;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Entity
@Getter
@Setter

@Table (name = "historiques")
public class Historique {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private int id_employe;
    @Column (name = "actions", nullable = false)
    private String action;
    @Column(name = "date_action", nullable = false)
    private LocalDate dateAction;


    public  Historique(){

    }

    public  Historique(int id, int id_employe, String action, LocalDate date_action){
        this.id = id;
        this.id_employe = id_employe;
        this.action = action;
        this.dateAction = date_action;
    }
}

