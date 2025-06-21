import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {AuthService} from '@auth0/auth0-angular';
import {AsyncPipe, DOCUMENT} from '@angular/common';

@Component({
  selector: 'app-auth-button',
  imports: [
    MatIcon,
    MatIconButton,
    AsyncPipe
  ],
  template: `
    <!--    If is logged -> show logout button-->
    @if (auth.isAuthenticated$ | async ) {
      <button mat-icon-button aria-label="Logout Icon"
              (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
      <!-- If not logged -> show login button -->
    } @else {
      <button mat-icon-button aria-label="Login Icon"
              (click)=login()>
        <mat-icon>login</mat-icon>
      </button>
    }
  `,


  styleUrl: './auth-button.component.css',
  standalone: true
})
export class AuthButtonComponent {
  protected auth = inject(AuthService);
  protected document = inject(DOCUMENT);


  protected login() {
    this.auth.loginWithRedirect();
  }

  protected logout() {
    console.log(this.auth.isAuthenticated$)

    this.auth.logout({ logoutParams: { returnTo: this.document.location.origin } });
  }
}
