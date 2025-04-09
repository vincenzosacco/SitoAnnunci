import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AnnuncioComponent} from "../../api/annuncio/annuncio.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, AnnuncioComponent], // Importa RouterOutlet per il routing

})
export class HomeComponent{
}
