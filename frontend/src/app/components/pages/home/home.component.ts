import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SearchBarComponent} from './search-bar/search-bar.component';
import {FiltersComponent} from './filters/filters.component';
import {ResultsComponent} from './results/results.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, SearchBarComponent, FiltersComponent, ResultsComponent], // Importa RouterOutlet per il routing

})
export class HomeComponent{
}
