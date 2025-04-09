import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {LoginButtonComponent} from "../../other/login-button/login-button.component";

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatIcon,
    MatIconButton,
    LoginButtonComponent,
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.css',
})

export class HeaderComponent {
  @Input() title = 'My Application';
  // Using event emitter to notify parent component, make the component reusable and decoupled
  @Output() menuButtonClick = new EventEmitter<any>();
  @Output() loginButtonClick = new EventEmitter<any>();

  onMenuButtonClick() {
    this.menuButtonClick.emit(); // Emit the event to parent component
    console.debug('HeaderComponent: onMenuButtonClick()');
  }



}
