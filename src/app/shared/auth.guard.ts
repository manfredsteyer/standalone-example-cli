import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard /* implements CanActivate */ {
  auth = inject(AuthService);

  canActivate(): boolean {
    return this.auth.isAuthenticated();
  }
}
