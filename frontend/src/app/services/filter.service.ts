import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  private searchFiltersSubject = new BehaviorSubject<any>({
    titolo: '',
    categoria: '',
    indirizzo: ''
  });
  searchFilters$ = this.searchFiltersSubject.asObservable();

  private advancedFiltersSubject = new BehaviorSubject<any>({
      in_vendita: null, // true = in vendita, false = cercasi
    prezzoDa: null,
    prezzoA: null,
    superficieDa: null,
    superficieA: null
  });
  advancedFilters$ = this.advancedFiltersSubject.asObservable();


  aggiornaFiltriRicerca(filtroTitolo: string, filtroCategoria: number, filtroIndirizzo: string) {
    this.searchFiltersSubject.next({
      titolo: filtroTitolo,
      categoria: filtroCategoria,
      indirizzo: filtroIndirizzo
    });
  }


  //Metodi per aggiornare i filtri del pannello laterale
  aggiornaFiltroForSale(valore: boolean | null) {
    this.updateAdvancedFilters({ in_vendita: valore });
  }

  aggiornaFiltroPrezzoDa(valore: number | null) {
    this.updateAdvancedFilters({ prezzoDa: valore });
  }

  aggiornaFiltroPrezzoA(valore: number | null) {
    this.updateAdvancedFilters({ prezzoA: valore });
  }

  aggiornaFiltroSuperficieDa(valore: number | null) {
    this.updateAdvancedFilters({ superficieDa: valore });
  }

  aggiornaFiltroSuperficieA(valore: number | null) {
    this.updateAdvancedFilters({ superficieA: valore });
  }

  private updateAdvancedFilters(nuoviFiltri: Partial<any>) {
    const filtriAttuali = this.advancedFiltersSubject.value;
    this.advancedFiltersSubject.next({ ...filtriAttuali, ...nuoviFiltri });
  }

}
