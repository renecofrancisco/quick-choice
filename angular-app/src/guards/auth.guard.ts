// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthState } from '../app/utils/auth-state';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authState = inject(AuthState);

  const user = authState.user;
  if (!user) {
    router.navigate(['/login']); // redirect if not logged in
    return false;
  }

  return true;
};
