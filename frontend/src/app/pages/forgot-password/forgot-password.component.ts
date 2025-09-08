import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'], 
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private router : Router) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
  if (this.forgotForm.invalid) return;

  const emailDTO = { email: this.forgotForm.value.email }; // ✅ objet JSON

  this.http.post('http://localhost:8080/api/employes/forgot-password', emailDTO, { 
      headers: { 'Content-Type': 'application/json' }, // nécessaire
      responseType: 'text' // car ton endpoint renvoie du texte
    })
    .subscribe({
      next: (res: any) => {
        this.successMessage = res; // "Email de réinitialisation envoyé !"
        this.errorMessage = '';
      },
      error: (err) => {
        if (err.status === 404) {
          this.errorMessage = 'Email inconnu';
        } else {
          this.errorMessage = 'Erreur serveur, réessayez';
        }
        this.successMessage = '';
      }
    });
}



  retour(){
    /* alert('redirection'); */
    this.router.navigate(['/connexion']);
  }
}
