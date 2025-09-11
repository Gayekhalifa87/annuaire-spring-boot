import { Injectable } from '@angular/core';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private keycloak!: KeycloakInstance;
  private initialized = false;

  constructor() {
    // ⚡ Pas d’instanciation directe ici → on le fait dans init()
  }

  /** Initialise Keycloak */

  private initPromise: Promise<void> | null = null;

async init(): Promise<void> {
  if (this.initPromise) return this.initPromise; // ← si déjà initialisé, retourne la promesse

  this.keycloak = new Keycloak({
    url: 'http://localhost:8180/',
    realm: 'annuaire',
    clientId: 'annuaire-frontend'
  });

  this.initPromise = this.keycloak.init({
    onLoad: 'check-sso',
    silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
  }).then(() => {
    this.initialized = true;
    if (this.isLoggedIn()) {
      console.log('✅ Connecté, token actuel :', this.getToken());
    }
  }).catch(err => {
    console.error('❌ Erreur Keycloak', err);
  });

  return this.initPromise;
}

  isInitialized(): boolean {
    return this.initialized;
  }

  /** Connexion */
  async login(): Promise<void> {
    if (!this.initialized) throw new Error("Keycloak non initialisé !");
    return this.keycloak.login();
  }

  /** Déconnexion */
  async logout(): Promise<void> {
    if (!this.initialized) return;
    return this.keycloak.logout({ redirectUri: window.location.origin });
  }

  /** Retourne le token JWT actuel */
  getToken(): string | undefined {
    return this.initialized ? this.keycloak.token : undefined;
  }

  /** Vérifie si l'utilisateur est connecté */
  isLoggedIn(): boolean {
    return this.initialized && !!this.keycloak.token;
  }

  /** Profil utilisateur (username, email, roles, etc.) */
  getUserProfile(): any {
    return this.initialized ? this.keycloak.tokenParsed : null;
  }

  /** Rafraîchir le token */
  async updateToken(minValidity: number = 30): Promise<boolean> {
    if (!this.initialized) return false;
    try {
      const refreshed = await this.keycloak.updateToken(minValidity);
      return refreshed;
    } catch (err) {
      console.error('❌ Erreur lors du refresh du token', err);
      return false;
    }
  }
}
