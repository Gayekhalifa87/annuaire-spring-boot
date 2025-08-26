package com.annuaire.khalifa.annuaire.models;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.autoconfigure.domain.EntityScan;
@Entity
@Getter
@Setter
@Table(name = "employes")
public class Employe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "id_ann" ,nullable = false)
    private  int idAnn;
    @Column(name = "nom",nullable = false)
    private String Nom;
    @Column(name = "prenom",nullable = false)
    private String Prenom ;

    private String Email;
    private String Telephone;
    private String Password;
    private int Ip;

    public Employe(){

    }
    public Employe(int id_ann, String nom, String prenom, String email, String password, String telephone, int ip){
        this.idAnn = id_ann;
        this.Nom = nom;
        this.Prenom = prenom;
        this.Email = email;
        this.Telephone = telephone;
        this.Password = password;
        this.Ip = ip;
    }
}
