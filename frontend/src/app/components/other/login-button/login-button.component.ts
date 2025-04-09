import {Component} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'app-login-button',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './login-button.component.html',
  styleUrl: './login-button.component.css'
})
export class LoginButtonComponent {

  handleLogin(): void {
    console.debug('LoginButtonComponent: handleLogin')
  }

}
