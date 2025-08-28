package com.annuaire.khalifa.annuaire.services;

import com.annuaire.khalifa.annuaire.models.Employe;
import com.annuaire.khalifa.annuaire.repository.EmployeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeService {
    private final EmployeRepository employeRepository ;

    public EmployeService(EmployeRepository employeRepository) {
        this.employeRepository = employeRepository;
    }
    public List<Employe> getAllEmployes() {
        return employeRepository.findAll();
    }
    public Optional<Employe> findById(int id) {
        return employeRepository.findById(id);
    }
    public Optional<Employe> findByIp(int ip) {
        return employeRepository.findByIp(ip);
    }
    public Optional<Employe> findByEmployeId(int employeId) {
        return employeRepository.findByEmployeId(employeId);
    }
    public Optional<Employe> findByTelephone(String telephone) {
        return employeRepository.findByTelephone(telephone);
    }

    //Creation d un nouvel employe
    public Employe createEmploye(Employe employe) {
        return employeRepository.save(employe);
    }
    // Suppression d’un employé
    public boolean deleteEmploye(int id) {
        return employeRepository.findById(id)
                .map(e -> {
                    employeRepository.delete(e);
                    return true;
                })
                .orElse(false);
    }
    public boolean updateEmploye(int id, int newIp, String newPassword, String newTelephone) {
        return employeRepository.findById(id)
                .map(e -> {
                    e.setIp(newIp);
                    e.setTelephone(newTelephone);
                    e.setPassword(newPassword);
                    employeRepository.save(e);
                    return true;
                })
                .orElse(false);
    }

    public boolean changeRole(int id, String newRole) {
        return employeRepository.findById(id)
                .map(e -> {
                    e.setRole(newRole);
                    employeRepository.save(e);
                    return true;
                })
                .orElse(false);
    }

}