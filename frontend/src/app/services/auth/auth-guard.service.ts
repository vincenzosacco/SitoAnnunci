import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthFacadeService} from './auth-facade.service';
import {catchError, combineLatest, first, firstValueFrom, map, of} from "rxjs";
import {switchMap} from "rxjs/operators";

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
     * - If the user is not authenticated, redirect them to the 'no-auth-redirect' route.
     * - If the user is authenticated, check if the user has the required roles (if any) to access the route.
     * @param route The activated route snapshot.
     * @returns A promise that resolves to `true` if the user is authenticated and has the required roles otherwise `false`.
     */
    async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
        const canActivate = await firstValueFrom(this.canAccess$(route).pipe(first()));
        if (!canActivate) {
            console.debug('Access denied - Redirecting to "no-auth-redirect"');
            if (!await this.router.navigate(['/no-auth-redirect'])) {
                console.error('Navigation to "no-auth-redirect" failed');
            }
        }
        return canActivate;
    }

    // /**
    //  * Check if the user can access a route
    //  * (based on canActivate logic, but without side effects like redirection and console debugging).
    //  * @param route The activated route snapshot.
    //  * @returns A promise that resolves to `true` if the user can access the route otherwise `false`.
    //  */
    // async canAccess(route: ActivatedRouteSnapshot | string): Promise<boolean> {
    //     // PARSE ROUTE if string//
    //     /*TODO I need to check if this approach can cause bugs. Since there is no built-in way to parse
    //     *  a string to an existing route, this way needs to be tested */
    //     if (typeof route === 'string') {
    //         const url = new URL(route, window.location.origin);
    //         const tmpRoute = this.router.config.find(r => r.path === url.pathname.replace(/^\//, ''));
    //         if (!tmpRoute) {
    //             throw new Error(`Route ${route} not found in router config`);
    //         }
    //
    //         route = {
    //             data: tmpRoute.data || {},
    //         } as ActivatedRouteSnapshot;
    //     }
    //
    //
    //     // CHECK AUTHENTICATION //
    //     let ret = true;
    //     const isAuthenticated = await firstValueFrom(this.auth.isAuthenticated$);
    //     if (!isAuthenticated) {
    //         ret = false;
    //     }
    //
    //     // CHECK ROLES /
    //     if (isAuthenticated && route.data && route.data['roles'].length != 0) {
    //         const requiredRoles = route.data['roles'] as string[];
    //
    //         // If roles are required, check if the user has all required roles
    //         let userRoles: string | string[];
    //         try {
    //             userRoles = this.auth.roles() as string[] || []; // should be string[]
    //             ret = requiredRoles.every(role => userRoles.includes(role));
    //         } catch (error) {
    //             ret = false;
    //         }
    //     }
    //     console.debug(ret);
    //     return ret;
    // }


    canAccess$(route: ActivatedRouteSnapshot | string) {
        // Convert string route to snapshot (same as your code)
        if (typeof route === 'string') {
            const url = new URL(route, window.location.origin);
            const tmpRoute = this.router.config.find(r => r.path === url.pathname.replace(/^\//, ''));
            if (!tmpRoute) {
                throw new Error(`Route ${route} not found in router config`);
            }
            route = { data: tmpRoute.data || {} } as ActivatedRouteSnapshot;
        }

        /* combineLatest allows to reactively check both authentication status and user roles;
         * it's necessary because user roles change after login, so we need to wait for both observables to emit new values.
        */
        return combineLatest([this.auth.isAuthenticated$, this.auth.user$]).pipe(
            /* switchMap is used to flatten the observable returned by combineLatest.
             * It also cancels previous subscriptions if new values are emitted, ensuring
             * only the latest authentication and user data are considered.
             */
            switchMap(([isAuthenticated, user]) => {
                if (!isAuthenticated) return of(false);

                const requiredRoles = (route.data?.['roles'] as string[]) || [];
                if (!requiredRoles.length) return of(true);

                const userRoles = user ? user['https://custom-claim.com/roles'] || [] : [];
                return of(requiredRoles.every(role => userRoles.includes(role)));
            }),
            catchError(() => of(false))
        );
    }

}


