import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchComponent } from '../../../components/search/search.component';
import { EmployeService, Employe } from '../../../core/employe.service';
import Swal from 'sweetalert2';
import { RouterLink, Router } from "@angular/router";
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchComponent, RouterLink],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  
  addEmployeeForm: FormGroup;
  showAddForm = false;
  isEditing = false;
  editingEmployeeId: number | null = null;
  employes: Employe[] = [];

  // Pagination
  currentPage = 0;
  pageSize = 6;
  totalPages = 0;
  pages: number[] = [];
  totalEmployes = 0;

  @Input() user: any;

  constructor(
    private employeService: EmployeService,
    private authService: AuthService,
    private router: Router,
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
      password: [''] // Pour ajout uniquement
    });
  }

  ngOnInit() {
    this.loadEmployees();
  }

  /** ✅ Charger employés + total */
  loadEmployees() {
    this.employeService.getAllCombinedEmployes().subscribe({
      next: (emps) => {
        this.employes = emps;
        this.calculatePagination();
      },
      error: (err) => console.error('Erreur chargement employés', err)
    });

    this.employeService.getTotalEmployes().subscribe({
      next: (count) => (this.totalEmployes = count),
      error: (err) => console.error('Erreur total employés', err)
    });
  }

  /** ✅ Pagination */
  calculatePagination() {
    this.totalPages = Math.ceil(this.employes.length / this.pageSize);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i);
    this.currentPage = Math.min(this.currentPage, this.totalPages - 1);
  }

  get paginatedEmployes(): Employe[] {
    const start = this.currentPage * this.pageSize;
    return this.employes.slice(start, start + this.pageSize);
  }

  goToPreviousPage() {
    if (this.currentPage > 0) this.currentPage--;
  }
  goToNextPage() {
    if (this.currentPage < this.totalPages - 1) this.currentPage++;
  }
  goToPage(page: number) {
    this.currentPage = page;
  }

  /** ✅ Ouvrir modal Ajout */
  openAddForm() {
    this.resetForm();
    this.showAddForm = true;
  }

  /** ✅ Ouvrir modal Édition */
  editEmployee(emp: Employe) {
    this.isEditing = true;
    this.editingEmployeeId = emp.id ?? null;
    this.addEmployeeForm.patchValue(emp);
    this.showAddForm = true;
    this.isEditing = true;
  this.showAddForm = true; // ✅ Ouvre la modal
  this.addEmployeeForm.patchValue(emp); // ✅ Remplit le formulaire avec les données existantes
  }

  /** ✅ Ajouter employé */
  addEmploye() {
    if (this.addEmployeeForm.invalid) return;

    const newEmploye = this.addEmployeeForm.value;
    this.employeService.addEmploye(newEmploye).subscribe({
      next: (emp) => {
        this.employes.push(emp);
        this.resetForm();
        Swal.fire({ icon: 'success', title: 'Employé ajouté', timer: 1500 });
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Erreur ajout', err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible d\'ajouter l\'employé.' });
      }
    });
  }

  /** ✅ Mettre à jour employé */
  updateEmploye() {
    if (!this.editingEmployeeId || this.addEmployeeForm.invalid) return;

    const updatedData = this.addEmployeeForm.value;
    delete updatedData.password; // Pas de changement de mot de passe ici

    this.employeService.updateEmploye(this.editingEmployeeId, updatedData).subscribe({
      next: (updatedEmp) => {
        this.employes = this.employes.map(e => e.id === updatedEmp.id ? updatedEmp : e);
        this.resetForm();
        Swal.fire({ icon: 'success', title: 'Modification réussie', timer: 1500 });
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Erreur update', err);
        Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de modifier l\'employé.' });
      }
    });
  }

  /** ✅ Supprimer employé */
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
            Swal.fire({ icon: 'success', title: 'Employé supprimé', timer: 1500 });
            this.calculatePagination();
            this.loadEmployees();
          },
          error: (err) => {
            console.error('Erreur suppression', err);
            Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de supprimer.' });
          }
        });
      }
    });
  }

  /** ✅ Changer rôle */
  switchRole(emp: Employe) {
    if (!emp.id) return;

    this.employeService.switchRole(emp.id).subscribe({
      next: (updatedEmp) => {
        this.employes = this.employes.map(e => e.id === updatedEmp.id ? updatedEmp : e);
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: `Le rôle de ${updatedEmp.nom} est maintenant ${updatedEmp.role}`,
          timer: 2000,
          showConfirmButton: false
        });
        this.loadEmployees();
      },
      error: () => Swal.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de changer le rôle.' })
    });
  }

  /** ✅ Réinitialiser modal */
  resetForm() {
    this.addEmployeeForm.reset({ role: 'user' });
    this.showAddForm = false;
    this.isEditing = false;
    this.editingEmployeeId = null;
  }

  /** ✅ Résultat recherche */
  onSearchResult(results: Employe[]) {
    this.employes = results;
    this.currentPage = 0;
    this.calculatePagination();
  }

  /** ✅ Déconnexion */
  logout() {
    this.authService.logout();
    this.router.navigate(['/accueil']);
  }
}
