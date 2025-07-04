import {Injectable} from '@angular/core';
import {Router, CanActivate } from '@angular/router';
import {map, Observable, tap} from 'rxjs';
import {AuthFacadeService} from './auth-facade.service';

@Injectable(
  {providedIn: 'root'}
)
/**
 * AuthGuard service to protect routes based on user authentication status.
 * Implements the CanActivate interface to determine whether a route can be activated.
 */
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthFacadeService, private router: Router) {
  }

  /**
   * Checks if the user is authenticated by subscribing to the `isAuthenticated$` Observable.
   * If the user is not authenticated, redirect them to the 'no-auth-redirect' route.
   *
   * @returns {Observable<boolean>} An Observable that emits `true` if the user is authenticated, otherwise `false`.
   */
  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      // 1 - Side effect to handle unauthenticated users.
      // Redirects the user to 'no-auth-redirect' if they are not authenticated.
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/no-auth-redirect']);
        }
      }),
      // 2- Maps the authentication status to a boolean value.
      map(isAuthenticated => isAuthenticated)
    );
  }
}

