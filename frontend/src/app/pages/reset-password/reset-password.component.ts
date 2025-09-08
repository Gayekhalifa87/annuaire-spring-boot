import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  token!: string;
  password = '';
  confirm = '';

  showPassword = false;
  showConfirm = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // Récupération du token depuis le paramètre de route
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token')!;
      console.log('Token récupéré :', this.token);
    });
  }

  onSubmit() {
    if (this.password !== this.confirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    this.http.post(
  'http://localhost:8080/api/employes/reset-password',
  { token: this.token, newPassword: this.password },
  { responseType: 'text' } // <-- important
).subscribe({
  next: (res: any) => {
    alert(res); // "Mot de passe réinitialisé avec succès !"
    this.router.navigate(['/login']);
  },
  error: (err) => {
    console.error(err);
    alert(err.error?.message || 'Erreur lors de la réinitialisation');
  }
});
  }
}
