import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
export const AuthGuard:
  CanActivateFn = () => {

    const authService =
      inject(AuthService);

    const router =
      inject(Router);

    return authService.isLoggedIn()
      ? true
      : router.createUrlTree(
        ['/admin/login']
      );

  };
