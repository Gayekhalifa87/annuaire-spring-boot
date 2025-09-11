// src/app/core/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KeycloakService } from './keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser = new BehaviorSubject<any>(null);
  public currentUser$ = this._currentUser.asObservable();

  constructor(private keycloakService: KeycloakService) {}

  /** 🔹 Login via Keycloak */
  async login(): Promise<void> {
    await this.keycloakService.login();
    if (this.keycloakService.isLoggedIn()) {
      const profile = this.keycloakService.getUserProfile();
      localStorage.setItem('token', this.keycloakService.getToken() || '');
      localStorage.setItem('currentUser', JSON.stringify(profile));
      this._currentUser.next(profile);
    }
  }

  /** 🔹 Logout via Keycloak */
  async logout(): Promise<void> {
    this._currentUser.next(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    await this.keycloakService.logout();
  }

  /** 🔹 Retourne le token actuel (JWT Keycloak) */
  getToken(): string | null {
    return this.keycloakService.getToken() || null;
  }

  /** 🔹 Définit l’utilisateur courant (si besoin) */
  public setCurrentUser(user: any) {
    this._currentUser.next(user);
  }

  /** 🔹 Retourne l’utilisateur courant */
  public get currentUser(): any {
    return this._currentUser.value;
  }

  /** 🔹 Vérifie si connecté */
  isLoggedIn(): boolean {
    return this.keycloakService.isLoggedIn();
  }
}
