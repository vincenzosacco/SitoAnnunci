import {Component, Optional} from '@angular/core';
import {AuthFacadeService} from '../../../services/auth/auth-facade.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-no-auth-redirect',
  imports: [

  ],
  template: `
      <h1>Authentication Error </h1>
      <p>Please log in to access the requested resource. </p>
      <p>
          <button (click)="login()">Login</button>
      </p>
  `,
  styleUrl: './no-auth-redirect.component.css'
})
/**
 * Component that prompts the user to log in when they attempt to access a resource without authentication.
 * Can be used as a standalone page or within a dialog (pop-up).
 */
export class NoAuthRedirectComponent {
    constructor(
        private authFacadeService: AuthFacadeService,
        @Optional() private dialogRef?: MatDialogRef<NoAuthRedirectComponent>
    ) {}

    login() {
        this.authFacadeService.login();
        this.dialogRef?.close();
    }
}
