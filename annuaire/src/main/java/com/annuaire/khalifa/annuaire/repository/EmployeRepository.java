package com.annuaire.khalifa.annuaire.repository;

import com.annuaire.khalifa.annuaire.models.Employe;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeRepository extends JpaRepository<Employe, Long> {

    // Rechercher un employé par son email
    Optional<Employe> findByEmail(String email);

    // Vérifier si un email existe
    boolean existsByEmail(String email);

    //Rechercher en employe par son ip
    Optional<Employe> findByIp(int ip);
    boolean existsByIp(int ip);

    //Rechercher par id
    Optional<Employe> findByIdAnn(int idAnn);
    boolean existsByIdAnn(int idAnn);

}