import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchComponent } from '../../../components/search/search.component';
import { EmployeService, Employe } from '../../../core/employe.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommonModule, SearchComponent],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  addEmployeeForm: FormGroup;
  showAddForm = false;
  isEditing = false;
  editingEmployeeId: number | null = null;
  employes: Employe[] = [];

  constructor(
    private employeService: EmployeService,
    private fb: FormBuilder
  ) {
    this.addEmployeeForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      poste: ['', Validators.required],
      direction: ['', Validators.required],
      service: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ip: ['', Validators.required],
      telephone: ['', Validators.required],
      role: ['user', Validators.required],
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  // Charger tous les employés
  loadEmployees() {
    this.employeService.getAllCombinedEmployes().subscribe({
      next: (emps) => this.employes = emps,
      error: (err) => console.error('Erreur lors du chargement des employés', err)
    });
  }

  // Ouvrir le formulaire pour modifier un employé
  editEmployee(emp: Employe) {
    this.isEditing = true;
    this.editingEmployeeId = emp.id ?? null; 
    this.addEmployeeForm.patchValue(emp);
    this.showAddForm = true;
  }

  // Mettre à jour un employé
  updateEmploye() {
  if (!this.editingEmployeeId) return;

  // On récupère seulement les champs modifiés
  const updatedData: Partial<Employe> = {};

  if (this.addEmployeeForm.get('ip')?.dirty) {
    updatedData.ip = this.addEmployeeForm.get('ip')?.value;
  }

  if (this.addEmployeeForm.get('telephone')?.dirty) {
    updatedData.telephone = this.addEmployeeForm.get('telephone')?.value;
  }

  if (this.addEmployeeForm.get('password')?.dirty) {
    updatedData.password = this.addEmployeeForm.get('password')?.value;
  }

  this.employeService.updateEmploye(this.editingEmployeeId, updatedData as Employe)
    .subscribe({
      next: (updatedEmp) => {
        this.employes = this.employes.map(e => e.id === updatedEmp.id ? updatedEmp : e);
        this.resetForm();
        Swal.fire({
          icon: 'success',
          title: 'Modification reussie',
          timer: 1500,
        })
        this.loadEmployees(); 
      },
      error: (err) => console.error('Erreur lors de la mise à jour :', err)
    });
}

  // Supprimer un employé
  deleteEmployee(emp: Employe) {
  if (!emp.id) return;

  Swal.fire({
    title: `Supprimer ${emp.nom} ?`,
    text: "Cette action est irréversible.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.employeService.deleteEmploye(emp.id!).subscribe({
        next: () => {
          this.employes = this.employes.filter(e => e.id !== emp.id);
          Swal.fire({
            icon: 'success',
            title: 'Employé supprimé',
            timer: 1500,
          });
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Impossible de supprimer l\'employé. Réessayez plus tard.'
          });
        }
      });
    }
  });
}

  // Réinitialiser le formulaire
  resetForm() {
    this.addEmployeeForm.reset({ role: 'user' });
    this.showAddForm = false;
    this.isEditing = false;
    this.editingEmployeeId = null;
  }

  // Ouvrir le formulaire pour ajouter un nouvel employé
  openAddForm() {
    this.resetForm();
    this.showAddForm = true;
  }




  switchRole(emp: Employe) {
  if (!emp.id) return;

  this.employeService.switchRole(emp.id).subscribe({
    next: (updatedEmp) => {
      this.employes = this.employes.map(e => e.id === updatedEmp.id ? updatedEmp : e);
      this.loadEmployees();
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: `Le rôle de ${updatedEmp.nom} est maintenant ${updatedEmp.role}`,
        timer: 2000,
        showConfirmButton: false
      });
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de changer le rôle. Réessayez plus tard.'
      });
    }
  });
}
}

