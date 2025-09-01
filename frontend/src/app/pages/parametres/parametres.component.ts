import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsHeaderComponent } from '../../components/settings-header/settings-header.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SettingsHeaderComponent],
  templateUrl: './parametres.component.html',
  styleUrls: ['./parametres.component.css']
})
export class ParametresComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;  
  userId: string = '';

  showPassword = true;

  constructor(
    private fb: FormBuilder,
    
  ) {
    // Formulaire profil
    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ip: [''],
      telephone: [''],
      poste: [''],
      direction: [''],
      service: ['']
    });

    // Formulaire mot de passe
    this.passwordForm = this.fb.group({
      current: ['', Validators.required],
      new: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

    ngOnInit() {
    
  }

  // Vérifie que "new" et "confirm" correspondent
  passwordMatchValidator(form: FormGroup) {
    return form.get('new')?.value === form.get('confirm')?.value
      ? null
      : { mismatch: true };
  }

  saveChanges() {
 
  }
  changePassword() {
  
}
}
