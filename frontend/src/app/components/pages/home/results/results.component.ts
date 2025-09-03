import {Component, OnInit} from '@angular/core';
import {FilterService} from '../../../../services/filter.service';
import {NgForOf, NgIf} from '@angular/common';
import {AnnuncioService} from '../../../../services/api/annuncio.service';
import {AnnuncioModel} from '../../../api/annuncio/annuncio.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  styleUrl: './results.component.css'
})
export class ResultsComponent implements OnInit {
  allResults: AnnuncioModel[] = [];
  results: AnnuncioModel[] = [];
  searchFilters: any = {};
  advancedFilters: any = {};

  constructor(
    private filterService: FilterService,
    private annuncioService: AnnuncioService
  ) {}


  categoriaMap: Record<number, string> = {
      1: 'Appartamento',
      2: 'Villa',
      3: 'Attico',
      4: 'Monolocale',
      5: 'Terreno',
      6: 'Box Auto',
      7: 'Ufficio'
  };

  ngOnInit() {
    this.annuncioService.getAll().subscribe((data) => {
      this.allResults = data;
    });

    this.filterService.searchFilters$.subscribe(searchFilters => {
      this.searchFilters = searchFilters;
      this.applyFilters();
    });

    this.filterService.advancedFilters$.subscribe(advancedFilters => {
      this.advancedFilters = advancedFilters;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.results = this.allResults.filter(result => {
      let match = true;

      // Filtri della barra di ricerca
      if (this.searchFilters.titolo && !result.titolo.includes(this.searchFilters.titolo)) match = false;
      if (this.searchFilters.categoria && result.categoria_id !== this.searchFilters.categoria) match = false;
      if (this.searchFilters.indirizzo && result.indirizzo !== this.searchFilters.indirizzo) match = false;

      // Filtri avanzati laterali
      if (this.advancedFilters.in_vendita != null && result.in_vendita !== this.advancedFilters.in_vendita) match = false;
      if (this.advancedFilters.prezzoDa && result.prezzo < this.advancedFilters.prezzoDa) match = false;
      if (this.advancedFilters.prezzoA && result.prezzo > this.advancedFilters.prezzoA) match = false;
      if (this.advancedFilters.superficieDa && result.superficie < this.advancedFilters.superficieDa) match = false;
      if (this.advancedFilters.superficieA && result.superficie > this.advancedFilters.superficieA) match = false;


      return match;
    });
  }

  ordinaPer(campo: 'prezzo' | 'superficie', ordine: 'asc' | 'desc') {
    this.results.sort((a, b) => {
      if (ordine === 'asc') {
        return a[campo] - b[campo];
      } else {
        return b[campo] - a[campo];
      }
    });
  }
}
