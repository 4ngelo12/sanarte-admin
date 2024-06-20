import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { spinnerInterceptor } from './core/interceptors/spinner.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { ShowForRoleDirective } from './core/directives/show-for-role.directive';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), ShowForRoleDirective, provideHttpClient(withInterceptors([jwtInterceptor, spinnerInterceptor])),
  importProvidersFrom(JwtModule.forRoot({ config: { tokenGetter: () => localStorage.getItem('token') } })),]
};
