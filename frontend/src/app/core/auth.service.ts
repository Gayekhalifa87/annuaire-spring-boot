import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/employes/login';

  // ✅ BehaviorSubject pour suivre l'utilisateur connecté
  private _currentUser = new BehaviorSubject<any>(this.loadUserFromStorage());
  public currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {}

  /** 🔹 Charger utilisateur depuis localStorage */
  private loadUserFromStorage(): any {
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  /** 🔹 Login */
  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post<any>(this.apiUrl, body)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let msg = '';
          if (error.status === 401) {
            msg = error.error || 'Email ou mot de passe incorrect';
          } else if (error.status === 0) {
            msg = 'Impossible de contacter le serveur';
          } else {
            msg = `Erreur ${error.status} : ${error.statusText}`;
          }
          return throwError(() => msg);
        })
      );
  }

  /** 🔹 Mettre à jour l'utilisateur connecté */
  setCurrentUser(user: any) {
    this._currentUser.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /** 🔹 Récupérer l'utilisateur actuel */
  get currentUser(): any {
    return this._currentUser.value;
  }

  /** 🔹 Déconnexion */
  logout() {
    this._currentUser.next(null);
    localStorage.removeItem('currentUser');

    // Optionnel : notifier le backend
    this.http.post('http://localhost:8080/api/employes/logout', {}).subscribe({
      next: () => console.log('Déconnexion serveur OK'),
      error: err => console.error('Erreur lors de la déconnexion', err)
    });
  }
}
