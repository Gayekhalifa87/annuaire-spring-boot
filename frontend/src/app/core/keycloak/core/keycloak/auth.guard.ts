import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { KeycloakService } from '../keycloak.service';

export const authGuard: CanActivateFn = () => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (!keycloakService.isLoggedIn()) {
    router.navigate(['/accueil']); // redirige vers accueil si pas connecté
    return false;
  }

  return true;
};
