import { Component, OnInit } from '@angular/core';
import { FilterService } from '../../../../services/filter.service';
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
      if (this.searchFilters.titolo && !result.title.includes(this.searchFilters.titolo)) match = false;
      if (this.searchFilters.categoria && result.categoria !== this.searchFilters.categoria) match = false;
      if (this.searchFilters.citta && result.citta !== this.searchFilters.citta) match = false;

      // Filtri avanzati laterali
      if (this.advancedFilters.forSale != null && result.forSale !== this.advancedFilters.forSale) match = false;
      if (this.advancedFilters.prezzoDa && result.price < this.advancedFilters.prezzoDa) match = false;
      if (this.advancedFilters.prezzoA && result.price > this.advancedFilters.prezzoA) match = false;
      if (this.advancedFilters.superficieDa && result.superficie < this.advancedFilters.superficieDa) match = false;
      if (this.advancedFilters.superficieA && result.superficie > this.advancedFilters.superficieA) match = false;


      return match;
    });
  }

  ordinaPer(campo: 'price' | 'superficie', ordine: 'asc' | 'desc') {
    this.results.sort((a, b) => {
      if (ordine === 'asc') {
        return a[campo] - b[campo];
      } else {
        return b[campo] - a[campo];
      }
    });
  }
}
