// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ServiceContext } from '../app/services/service-context';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const serviceContext = inject(ServiceContext);
  const authService = serviceContext.value.authService;

  const user = await authService.getUser();
  if (!user) {
    router.navigate(['/login']); // redirect if not logged in
    return false;
  }

  return true;
};
