import {Component, inject} from '@angular/core';
import {AuthFacadeService} from '../../../services/auth-facade.service';

@Component({
  selector: 'app-no-auth-redirect',
  imports: [

  ],
  template: `
    <h1>Authentication Error </h1>
    <p>Please log in to access the requested resource. </p>
    <p>
      <button (click)="authService.login()">Login</button>
    </p>
  `,
  styleUrl: './no-auth-redirect.component.css'
})
export class NoAuthRedirectComponent {
  protected authService = inject(AuthFacadeService);
}
