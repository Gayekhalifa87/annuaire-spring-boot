/* import { AuthService } from '../../core/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsHeaderComponent } from '../../components/settings-header/settings-header.component';
import Swal from 'sweetalert2';
import { timer } from 'rxjs';

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
  showPassword = true;
  user: any; // utilisateur courant

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
    // 🔹 S'abonner à currentUser$ pour récupérer l'utilisateur
    this.authService.currentUser$.subscribe(user => {
      this.user = user;

      if (this.user) {
        this.profileForm.patchValue({
          nom: this.user.nom,
          prenom: this.user.prenom,
          email: this.user.email || '',
          ip: this.user.ip,
          telephone: this.user.telephone,
          poste: this.user.poste,
          direction: this.user.direction,
          service: this.user.service
        });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('new')?.value === form.get('confirm')?.value
      ? null
      : { mismatch: true };
  }

  saveChanges() {
    console.log('Profil modifié:', this.profileForm.value);
    Swal.fire('Succès', 'Profil mis à jour', 'success');
  }

  changePassword() {
    if (this.passwordForm.invalid) return;
    console.log('Changement mot de passe:', this.passwordForm.value);
    Swal.fire('Succès', 'Mot de passe mis à jour', 'success',);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
 */

import { AuthService } from '../../core/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsHeaderComponent } from '../../components/settings-header/settings-header.component';
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
  showPassword = true;
  user: any; // utilisateur courant

  constructor(private fb: FormBuilder, private authService: AuthService) {
    // ✅ Formulaire profil
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

    // ✅ Formulaire mot de passe
    this.passwordForm = this.fb.group({
      current: ['', Validators.required],
      new: ['', [Validators.required, Validators.minLength(6)]],
      confirm: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // ✅ Récupérer l'utilisateur connecté via AuthService
    this.authService.currentUser$.subscribe(user => {
      this.user = user;

      if (this.user) {
        this.profileForm.patchValue({
          nom: this.user.nom,
          prenom: this.user.prenom,
          email: this.user.email || '',
          ip: this.user.ip,
          telephone: this.user.telephone,
          poste: this.user.poste,
          direction: this.user.direction,
          service: this.user.service
        });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('new')?.value === form.get('confirm')?.value
      ? null
      : { mismatch: true };
  }

  /** ✅ Sauvegarde des modifications du profil */
  saveChanges() {
    if (this.profileForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir correctement les champs', 'error');
      return;
    }

    const updatedUser = { ...this.user, ...this.profileForm.value };

    // ✅ Met à jour dans AuthService et localStorage
    this.authService.setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    Swal.fire('Succès', 'Profil mis à jour avec succès', 'success');
  }

  /** ✅ Changer le mot de passe */
  changePassword() {
    if (this.passwordForm.invalid) {
      Swal.fire('Erreur', 'Veuillez remplir tous les champs correctement', 'error');
      return;
    }

    const { current, new: newPassword } = this.passwordForm.value;

    // ✅ Simulation de vérification du mot de passe actuel
    if (current !== '123456') { // Tu remplaceras ça par une vraie API
      Swal.fire('Erreur', 'Mot de passe actuel incorrect', 'error');
      return;
    }

    // ✅ Met à jour le mot de passe (simulé)
    Swal.fire('Succès', 'Mot de passe mis à jour avec succès', 'success');
    this.passwordForm.reset();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
