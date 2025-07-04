import {inject, Injectable} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {DOCUMENT} from '@angular/common';
import {HttpInterceptorFn} from '@angular/common/http';
import {catchError, from} from 'rxjs';
import {switchMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
/**
 * Authentication service. It's called 'facade' to don't confuse with the AuthService from auth0-angular,
 * which must not be used directly in the components (for a better separation of concerns).
 */
export class AuthFacadeService {
    private auth: AuthService = inject(AuthService);
    private document: Document = inject(DOCUMENT);
    isAuthenticated$ = this.auth.isAuthenticated$;

    // even if is marked as unused but it is used in templates,
    login() {
        this.auth.loginWithRedirect();
    }

    logout() {
        this.auth.logout({logoutParams: {returnTo: this.document.location.origin}});
    }


}

// This intercptor is used to intercept HTTP requests to add
// an Authorization header with a JWT token.

// This avoid the need to manually add the token to each request
// EXAMPLE:
// -- Without interceptor
//      this.auth.getAccessTokenSilently().then(token => {
//           this.http.get('http://localhost:8080/admin', {
//                 headers: { Authorization: `Bearer ${token}` }
//          }).subscribe(...)
//      });

// -- With interceptor
//      this.http.get('http://localhost:8080/admin').subscribe(...)

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);

    return auth.isAuthenticated$.pipe(
        switchMap(isAuthenticated => {
            if (!isAuthenticated) {
                console.warn('User not authenticated. Skipping token.');
                return next(req); // ✅ Return observable
            }

            return from(auth.getAccessTokenSilently()).pipe(
                switchMap(token => {
                    const authReq = req.clone({
                        setHeaders: { Authorization: `Bearer ${token}` }
                    });
                    return next(authReq);
                }),
                catchError(error => {
                    console.warn('Token retrieval failed, proceeding without token.\nError details ->\n', error);
                    return next(req); // ✅ Also return observable here
                })
            );
        })
    );
};



