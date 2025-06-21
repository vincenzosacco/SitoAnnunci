import {inject, Injectable} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {DOCUMENT} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
/**
 * Authentication service. It's called 'facade' to don't confuse with the AuthService from auth0-angular,
 * which must not be used directly in the components (for a better separation of concerns).
 */
export class AuthFacadeService {
  private auth:AuthService = inject(AuthService);
  private document:Document = inject(DOCUMENT);
  isAuthenticated$ = this.auth.isAuthenticated$;

  login() {
    this.auth.loginWithRedirect();
  }

  logout() {
    console.log(this.auth.isAuthenticated$)

    this.auth.logout({ logoutParams: { returnTo: this.document.location.origin } });
  }

}
