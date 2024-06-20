import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.service';

export const hasRoleGuard: CanActivateFn = (route, state) => {
  const lsService = inject(LocalstorageService);
  const router = inject(Router);
  const token = lsService.getToken();

  const allowedRoles = route.data?.['allowedRoles'];
  const permited = Boolean(token && allowedRoles.includes(lsService.getRole()));

  if (!permited) {
    return router.createUrlTree(['/']);
  }

  return true;
};

export const authorizationGuard: CanActivateFn = (route, state) => {
  return true;
};

