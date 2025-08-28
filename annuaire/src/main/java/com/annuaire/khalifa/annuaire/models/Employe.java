package com.annuaire.khalifa.annuaire.models;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "employes")
public class Employe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // PK auto-incrémentée

    @Column(unique = true, nullable = true)
    private Integer ip; // nullable pour éviter les conflits

    @Column(nullable = false)
    private String password;

    private String telephone;

    @Column(nullable = false)
    private String role;

    @Column(name = "external_id")
    private Integer employeId; // ID venant de la DB externe

    public Employe() {}

    public Employe(Integer ip, String password, String telephone, String role, Integer employeId) {
        this.ip = ip;
        this.password = password;
        this.telephone = telephone;
        this.role = role;
        this.employeId = employeId;
    }
}
