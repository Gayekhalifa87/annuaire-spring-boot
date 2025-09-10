import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak: Keycloak | null = null;

  init(): Promise<boolean> {
    this.keycloak = new Keycloak({
      url: 'http://localhost:8180',
      realm: 'annuaire',
      clientId: 'annuaire-frontend' 
    });

    // init() de keycloak-js retourne une Promise<boolean>
    return this.keycloak.init({
      onLoad: 'login-required',
      checkLoginIframe: false
    });
  }

  login() {
    this.keycloak?.login();
  }

  logout() {
    this.keycloak?.logout();
  }

  getToken(): string | undefined {
    return this.keycloak?.token;
  }

  isLoggedIn(): boolean {
    return !!this.keycloak?.token;
  }


}
