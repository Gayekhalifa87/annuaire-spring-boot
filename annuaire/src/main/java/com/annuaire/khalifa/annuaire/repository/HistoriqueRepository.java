package com.annuaire.khalifa.annuaire.repository;

import com.annuaire.khalifa.annuaire.models.Employe;
import com.annuaire.khalifa.annuaire.models.Historique;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HistoriqueRepository extends JpaRepository<Historique, Long> {


}