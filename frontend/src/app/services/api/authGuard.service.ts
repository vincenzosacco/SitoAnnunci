// import {Injectable} from '@angular/core';
// import {Router, CanActivate } from '@angular/router';
// import {AuthService} from './auth.service';
//
// @Injectable(
//   {providedIn: 'root'}
// )
// export class AuthGuardService implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {
//
//   }
//
//   // Can activate if user is logged in
//   canActivate(): boolean {
//     if (this.authService.isLogged()) {
//       return true;
//     } else {
//       console.warn('Access denied - user not logged in');
//       this.router.navigate(['/login']);
//       return false;
//     }
//   }
// }
