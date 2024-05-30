import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.service';

export const authorizationGuard: CanActivateFn = (route, state) => {
  const lsService = inject(LocalstorageService);
  const router = inject(Router);

  const validarToken = lsService.validateToken();

  if (validarToken) {
    window.location.reload();
    return router.createUrlTree(['/auth/login']);
  }

  const token = lsService.getToken();

  if (!token) {
    return router.createUrlTree(['/auth/login']);
  }

  return true;
};
