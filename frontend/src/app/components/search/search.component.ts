import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {


  
  

   directions: string[] = [];

  searchTerm: string = '';


  ngOnInit() {
   /*  console.log('ngOnInit appelé'); */ // 🔹 vérification
    this.loadDirections();
  }

  onInputChange() {


}

  clearSearch() {
    this.searchTerm = '';
  }

  quickSearch(term: string) {

  }


    loadDirections() {

  }
}
