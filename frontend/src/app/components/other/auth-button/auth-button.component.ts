import {Component, inject} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {AuthFacadeService} from '../../../services/auth-facade.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-auth-button',
  imports: [
    MatIcon,
    MatIconButton,
    AsyncPipe
  ],
  template: `
    <!--    If is logged -> show logout button-->
    @if (authService.isAuthenticated$ | async) {
      <button mat-icon-button aria-label="Logout Icon"
              (click)="authService.logout()">
        <mat-icon>logout</mat-icon>
      </button>
      <!-- If not logged -> show login button -->
    } @else {
      <button mat-icon-button aria-label="Login Icon"
              (click)=authService.login()>
        <mat-icon>login</mat-icon>
      </button>
    }
  `,


  styleUrl: './auth-button.component.css',
  standalone: true
})

export class AuthButtonComponent {
  protected authService = inject(AuthFacadeService);
}

