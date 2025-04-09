import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonComponent} from "./components/common/common.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonComponent],
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.css'
})
export class AppComponent {
  appTitle = 'SitoAnnunci';
}
