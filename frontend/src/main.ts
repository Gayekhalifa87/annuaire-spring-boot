// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { KeycloakService } from './app/core/keycloak/keycloak.service';
import { KeycloakInterceptor } from './app/core/keycloak/keyloak.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    KeycloakService,          // injection injectable
    { provide: KeycloakInterceptor, useClass: KeycloakInterceptor, multi: true }, // Interceptor HTTP
  ]
});
