import { Injectable } from '@angular/core';
import { AnnunciService } from './annunci.service';
import { Annuncio } from '../components/home/Annuncio'
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnnunciLazyProxyServiceProxyService {
  private cacheAnnunci: Annuncio[] | null = null;

  constructor(private annunciService: AnnunciService) {}

  getAnnunci(): Observable<Annuncio[]> {
    if (this.cacheAnnunci) {
      // Ritorna dati in cache (lazy loading evitato, è già caricato)
      return of(this.cacheAnnunci);
    } else {
      // Carica dati dal servizio originale e memorizza in cache
      return this.annunciService.getAnnunci().pipe(
        tap(annunci => this.cacheAnnunci = annunci)
      );
    }
  }

  rimuoviAnnuncio(id: number): Observable<void> {
    // Rimuovi l'annuncio e svuota cache per rifare fetch alla prossima get
    return new Observable<void>(observer => {
      this.annunciService.rimuoviAnnuncio(id).subscribe({
        next: () => {
          this.cacheAnnunci = null;
          observer.next();
          observer.complete();
        },
        error: err => observer.error(err)
      });
    });
  }
}
