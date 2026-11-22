import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const sesion = localStorage.getItem('usuario');

  if(sesion){
    return true;
  }

  return router.createUrlTree(['/']);
};
