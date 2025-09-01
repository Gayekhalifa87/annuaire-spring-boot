package com.annuaire.khalifa.annuaire.controllers;

import com.annuaire.khalifa.annuaire.dto.CombinedEmployeDTO;
import com.annuaire.khalifa.annuaire.external.ExternalApiMockService;
import com.annuaire.khalifa.annuaire.external.ExternalEmployeDTO;
import com.annuaire.khalifa.annuaire.models.Employe;
import com.annuaire.khalifa.annuaire.services.EmailService;
import com.annuaire.khalifa.annuaire.services.EmployeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/employes")
public class EmployeController {
    private final EmployeService employeService;
    private final EmailService emailService;
    private final ExternalApiMockService externalApiMockService;

    public EmployeController(EmployeService employeService, EmailService emailService, ExternalApiMockService externalApiMockService) {
        this.employeService = employeService;
        this.emailService = emailService;
        this.externalApiMockService = externalApiMockService;
    }
    //TESTONS LE MOCK
    @GetMapping("/test-mock/{externalId}")
    public ExternalEmployeDTO testExternalMock(@PathVariable Integer externalId) {
        return externalApiMockService.getExternalEmploye(externalId);
    }

    //POUR COMBINER LES DEUX BASES DE DONNEES
    @GetMapping("/combined/{id}")
    public ResponseEntity<CombinedEmployeDTO> getCombinedEmploye(@PathVariable int id) {
        CombinedEmployeDTO dto = employeService.getCombinedEmploye(id);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //TOUS LES EMPLOYES(MOCK +BASE INTERNE)
    @GetMapping("/combined")
    public List<CombinedEmployeDTO> getAllCombinedEmployes() {
        return employeService.getAllCombinedEmployes();
    }



    @GetMapping
    public List<Employe> getAllEmployes() {
        return employeService.getAllEmployes();
    }

    @GetMapping("/count")
    public long getTotalEmployes() {
        return employeService.getTotalEmployes();
    }

    @GetMapping("/search")
    public Optional<Employe> findByIp(@RequestParam int ip) {
        return employeService.findByIp(ip);
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
    public ResponseEntity<Employe> changeRole(@PathVariable int id) {
        return employeService.findById(id)
                .map(employeAvant -> {
                    String ancienRole = employeAvant.getRole();
                    // Change le rôle
                    Employe updated = employeService.changeRole(id);

                    // Email uniquement si USER → ADMIN
                    if ("USER".equalsIgnoreCase(ancienRole) && "ADMIN".equalsIgnoreCase(updated.getRole())) {
                        String to = employeService.getEmailFromExternal(updated.getEmployeId());

                        String subject = "Changement de rôle";
                        String body = "Bonjour " + updated.getIp() + ", toutes nos félicitations ! Vous êtes désormais administrateur.";

                        emailService.sendSimpleEmail(to, subject, body);
                    }

                    return ResponseEntity.ok(updated);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}