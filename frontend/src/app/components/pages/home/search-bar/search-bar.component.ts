import {Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterService} from '../../../../services/filter.service';


@Component({
  selector: 'app-search-bar',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  filtroTitolo: string = '';
  filtroCategoria: number = 0;
  filtroCitta: string = '';

  constructor(private filtersService: FilterService) {}

  aggiornaFiltri() {
    this.filtersService.aggiornaFiltriRicerca(this.filtroTitolo, this.filtroCategoria, this.filtroCitta);
  }


}
