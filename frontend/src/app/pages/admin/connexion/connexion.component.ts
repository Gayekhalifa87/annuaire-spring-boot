import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  connexionForm: FormGroup;
  private router = inject(Router);
  private authService = inject(AuthService);

  emailErrorMessage = '';
  passwordErrorMessage = '';
  message = '';
  showPassword = false; // On masque par défaut

  constructor(private fb: FormBuilder) {
    this.connexionForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  ngOnInit() {
    this.connexionForm.valueChanges.subscribe(() => {
      this.emailErrorMessage = '';
      this.passwordErrorMessage = '';
      this.message = '';
    });
  }

  /** 🔹 Login via AuthService */

  onLogin() {
  if (this.connexionForm.invalid) {
    const emailCtrl = this.connexionForm.get('email');
    const pwdCtrl = this.connexionForm.get('password');

    this.emailErrorMessage = emailCtrl?.hasError('required') ? 'Email requis' :
                             emailCtrl?.hasError('email') ? 'Email invalide' : '';
    this.passwordErrorMessage = pwdCtrl?.hasError('required') ? 'Mot de passe requis' :
                                pwdCtrl?.hasError('minlength') ? 'Minimum 8 caractères' : '';
    return;
  }

  const { email, password } = this.connexionForm.value;

  
  this.authService.login(email, password).subscribe({
  next: (res) => {
    console.log('✅ Connexion réussie :', res);
    this.router.navigate(['/admin']);
  },
  error: (err) => {
    console.error('❌ Erreur de connexion :', err);

    // Réinitialiser les messages
    this.emailErrorMessage = '';
    this.passwordErrorMessage = '';
    this.message = '';

    // Affichage selon le message du backend
    if (err.toLowerCase().includes('email')) {
      this.emailErrorMessage = err;
    } else if (err.toLowerCase().includes('mot de passe') || err.toLowerCase().includes('password')) {
      this.passwordErrorMessage = err;
    } else {
      this.message = err;
    }
  }
});
}

  /** 🔹 Toggle mot de passe */
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  /** 🔹 Naviguer vers mot de passe oublié */
  forgotPassword() {
    this.router.navigate(['/forgotpassword']);
  }

  /** 🔹 Retour */
  retour() {
    this.router.navigate(['/accueil']);
  }
}
