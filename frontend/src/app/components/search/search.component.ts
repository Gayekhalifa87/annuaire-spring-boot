import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeService, Employe } from '../../core/employe.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm: string = '';

  // 🔹 Déclarer la propriété pour stocker les résultats
  employes: Employe[] = [];

  constructor(private employeService: EmployeService) {}

  // 🔹 Type correct pour l'output
  @Output() searchEvent = new EventEmitter<Employe[]>();
  @Output() clearEvent = new EventEmitter<void>();

  // 🔹 Recherche par IP
  onSearch() {
  if (!this.searchTerm) return;

  const ip = Number(this.searchTerm);
  this.employeService.searchByIp(ip).subscribe({
    next: (result) => {
      // Si result est un tableau, on garde ; sinon on met dans un tableau
      this.employes = Array.isArray(result) ? result : (result ? [result] : []);
      this.searchEvent.emit(this.employes);
    },
    error: (err) => console.error('Erreur recherche', err)
  });
}


  clearSearch() {
    this.searchTerm = '';
    this.employes = []; // vide également la liste
    this.clearEvent.emit();
  }
}
