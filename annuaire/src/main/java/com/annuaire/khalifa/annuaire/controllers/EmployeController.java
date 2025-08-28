package com.annuaire.khalifa.annuaire.controllers;

import com.annuaire.khalifa.annuaire.models.Employe;
import com.annuaire.khalifa.annuaire.services.EmployeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employes")
public class EmployeController {
    private final EmployeService employeService;

    public EmployeController(EmployeService employeService) {
        this.employeService = employeService;
    }

    @GetMapping
    public List<Employe> getAllEmployes() {
        return employeService.getAllEmployes();
    }

    @GetMapping("/{id}")
    //@PathVariable int id → récupère la valeur de {id} de l’URL et la passe à ta méthode
    public Optional<Employe> findById(@RequestBody @PathVariable int id) {
        return employeService.findById(id);
    }

    @PostMapping
    //Creation d un nouvel employe
    public Employe createEmploye(@RequestBody Employe employe) {
        return employeService.createEmploye(employe);
    }
    //Modification d un employe
    @PutMapping("/{id}")
    public boolean updateEmploye(
            @PathVariable int id,
            @RequestBody Employe updatedEmploye) {
        // on reçoit un objet Employe contenant les nouvelles valeurs
        return employeService.updateEmploye(
                id,
                updatedEmploye.getIp(),
                updatedEmploye.getPassword(),
                updatedEmploye.getTelephone()
        );
    }
    @PatchMapping("/{id}")
    public boolean changeRole(
            @PathVariable int id,
            @RequestBody Employe changerRole) {
        return employeService.changeRole(
                id,
                changerRole.getRole()
        );
    }
}