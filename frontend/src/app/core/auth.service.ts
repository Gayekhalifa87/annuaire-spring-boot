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
  private _currentUser = new BehaviorSubject<any>(null);
  public currentUser$ = this._currentUser.asObservable();

  constructor(private http: HttpClient) {}

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
  }

  /** 🔹 Récupérer l'utilisateur actuel */
  get currentUser(): any {
    return this._currentUser.value;
  }
}
