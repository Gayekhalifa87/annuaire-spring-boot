import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/employes/login';

  constructor(private http: HttpClient) {}

  /** 🔹 Méthode de connexion */
  login(email: string, password: string): Observable<string> {
    const body = { email, password };
    return this.http.post(this.apiUrl, body, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let msg = '';
          if (error.error) {
            msg = error.error; // message envoyé par le backend
          } else if (error.status === 0) {
            msg = 'Impossible de contacter le serveur';
          } else {
            msg = `Erreur ${error.status} : ${error.statusText}`;
          }
          return throwError(() => msg);
        })
      );
  }
}
